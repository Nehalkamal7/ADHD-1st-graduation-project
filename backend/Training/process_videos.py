import cv2
import os
import json
import numpy as np
from adhd_gaze_tracking import ADHDGazeTracker
from tqdm import tqdm
from multiprocessing import Pool, cpu_count
import time

def convert_to_serializable(obj):
    """Convert numpy types to Python native types for JSON serialization"""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: convert_to_serializable(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(item) for item in obj]
    return obj

def process_video(video_path, output_dir, skip_frames=2, resize_factor=0.5):
    """Process a single video and extract ADHD-relevant features"""
    # Initialize tracker
    tracker = ADHDGazeTracker()
    
    # Open video
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error opening video: {video_path}")
        return None
    
    frame_count = 0
    start_time = time.time()
    
    # Process frames
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        # Skip frames to process faster
        if frame_count % skip_frames != 0:
            frame_count += 1
            continue
            
        # Reduce resolution for faster processing
        if resize_factor < 1.0:
            frame = cv2.resize(frame, None, fx=resize_factor, fy=resize_factor)
            
        # Process frame
        tracker.process_frame(frame)
        frame_count += 1
    
    # Get features
    features = tracker.get_adhd_features()
    
    # Release video
    cap.release()
    
    if features is None:
        print(f"Not enough frames for analysis in: {video_path}")
        return None
        
    # Add processing time to features
    features['processing_time'] = time.time() - start_time
    features['total_frames'] = frame_count
    features['processed_frames'] = frame_count // skip_frames
    
    return features

def process_single_video(args):
    """Wrapper function for multiprocessing"""
    video_file, input_dir, output_dir, label = args
    video_path = os.path.join(input_dir, video_file)
    features = process_video(video_path, output_dir)
    
    if features is not None:
        features['label'] = label
        serializable_features = convert_to_serializable(features)
        
        # Save individual video features
        output_file = os.path.join(output_dir, f"{os.path.splitext(video_file)[0]}_features.json")
        with open(output_file, 'w') as f:
            json.dump(serializable_features, f, indent=4)
            
    return features

def process_directory(input_dir, output_dir, label, num_processes=None):
    """Process all videos in a directory using multiprocessing"""
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Get all video files
    video_files = [f for f in os.listdir(input_dir) if f.endswith(('.mp4', '.avi', '.mov'))]
    
    # Determine number of processes
    if num_processes is None:
        num_processes = max(1, cpu_count() - 1)  # Leave one core free
    
    # Prepare arguments for multiprocessing
    process_args = [(video_file, input_dir, output_dir, label) for video_file in video_files]
    
    # Process videos in parallel
    print(f"Processing {len(video_files)} videos using {num_processes} processes...")
    with Pool(num_processes) as pool:
        all_features = list(tqdm(
            pool.imap(process_single_video, process_args),
            total=len(video_files),
            desc=f"Processing {label} videos"
        ))
    
    # Filter out None results
    all_features = [f for f in all_features if f is not None]
    
    return all_features

def main():
    # Directories
    adhd_videos_dir = "data/adhd_videos"
    control_videos_dir = "data/control_videos"
    output_dir = "data/features"
    
    # Process ADHD videos
    print("Processing ADHD videos...")
    adhd_features = process_directory(adhd_videos_dir, os.path.join(output_dir, "adhd"), 1)
    
    # Process control videos
    print("Processing control videos...")
    control_features = process_directory(control_videos_dir, os.path.join(output_dir, "control"), 0)
    
    # Combine all features
    all_features = adhd_features + control_features
    
    # Convert all features to serializable format
    serializable_features = [convert_to_serializable(features) for features in all_features]
    
    # Save combined features
    output_file = os.path.join(output_dir, "all_features.json")
    with open(output_file, 'w') as f:
        json.dump(serializable_features, f, indent=4)
    
    print(f"Processed {len(adhd_features)} ADHD videos and {len(control_features)} control videos")
    print(f"Total features saved to: {output_file}")

if __name__ == "__main__":
    main() 