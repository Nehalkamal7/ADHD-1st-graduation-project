import cv2
import numpy as np
import os
from adhd_gaze_tracking import ADHDGazeTracker
import logging
import time

logger = logging.getLogger(__name__)

class VideoProcessor:
    def __init__(self):
        self.gaze_tracker = ADHDGazeTracker()
        
    def process_video(self, video_path: str) -> dict:
        """
        Process a video file and extract ADHD-relevant features.
        
        Args:
            video_path: Path to the video file
            
        Returns:
            Dictionary containing extracted features
        """
        try:
            logger.info(f"Processing video: {video_path}")
            
            # Reset gaze tracker for new video
            self.gaze_tracker.reset()
            
            # Start timing
            start_time = time.time()
            
            # Open video file
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise Exception(f"Could not open video file: {video_path}")
            
            # Get video properties
            fps = cap.get(cv2.CAP_PROP_FPS)
            if fps <= 0:
                fps = 30.0  # Default to 30 FPS if invalid
            
            # Process frames and count manually since OpenCV might report invalid frame count
            frame_count = 0
            processed_frames = 0
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                    
                frame_count += 1
                # Process every 3rd frame to speed up processing
                if frame_count % 3 == 0:
                    self.gaze_tracker.process_frame(frame)
                    processed_frames += 1
                
                # Log progress every 100 frames
                if frame_count % 100 == 0:
                    logger.info(f"Processed {frame_count} frames")
            
            # Release video capture
            cap.release()
            
            # Calculate processing time
            processing_time = time.time() - start_time
            
            # Get ADHD features
            features = self.gaze_tracker.get_adhd_features()
            if features is None:
                raise Exception("Not enough frames for analysis")
                
            # Add video metadata
            features['video_duration'] = frame_count / fps
            features['processed_frames'] = processed_frames
            features['total_frames'] = frame_count
            features['original_fps'] = fps
            features['processing_time'] = processing_time
            
            logger.info("Video processing completed successfully")
            return features
            
        except Exception as e:
            logger.error(f"Error processing video: {str(e)}")
            raise 