import cv2
import dlib
import numpy as np
from scipy import stats
import os

class ADHDGazeTracker:
    def __init__(self):
        # Initialize face detector and facial landmark predictor
        self.face_detector = dlib.get_frontal_face_detector()
        predictor_path = os.path.join('gaze_tracking', 'trained_models', 'shape_predictor_68_face_landmarks.dat')
        self.landmark_predictor = dlib.shape_predictor(predictor_path)
        
        # Initialize tracking variables
        self.frame_count = 0
        self.blink_count = 0
        self.pupil_positions = []
        self.gaze_angles = []
        self.frame = None
        self.eyes_detected = False
        
        # ADHD-specific parameters
        self.blink_threshold = 3.8  # Threshold for blink detection
        self.saccade_threshold = 0.1  # Threshold for saccade detection
        self.min_frames_for_analysis = 30  # Minimum frames needed for analysis
        
    def process_frame(self, frame):
        """Process a single frame and extract ADHD-relevant features"""
        self.frame = frame
        self.frame_count += 1
        
        # Convert to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = self.face_detector(gray)
        if len(faces) == 0:
            self.eyes_detected = False
            return None
            
        # Get facial landmarks
        landmarks = self.landmark_predictor(gray, faces[0])
        
        # Extract eye regions and features
        features = self._extract_eye_features(landmarks, gray)
        if features is not None:
            self.pupil_positions.append(features['pupil_position'])
            self.gaze_angles.append(features['gaze_angle'])
            if features['is_blinking']:
                self.blink_count += 1
            self.eyes_detected = True
        else:
            self.eyes_detected = False
            
        return features
    
    def _extract_eye_features(self, landmarks, gray_frame):
        """Extract detailed eye features relevant for ADHD detection"""
        try:
            # Get eye regions from landmarks
            left_eye = self._get_eye_region(landmarks, "left")
            right_eye = self._get_eye_region(landmarks, "right")
            
            if left_eye is None or right_eye is None:
                return None
                
            # Process each eye
            left_features = self._process_eye(left_eye, gray_frame)
            right_features = self._process_eye(right_eye, gray_frame)
            
            if left_features is None or right_features is None:
                return None
                
            # Calculate combined features
            pupil_position = np.mean([left_features['pupil_pos'], right_features['pupil_pos']], axis=0)
            gaze_angle = np.mean([left_features['gaze_angle'], right_features['gaze_angle']])
            is_blinking = left_features['is_blinking'] or right_features['is_blinking']
            
            return {
                'pupil_position': pupil_position,
                'gaze_angle': gaze_angle,
                'is_blinking': is_blinking,
                'eye_openness': np.mean([left_features['openness'], right_features['openness']])
            }
            
        except Exception as e:
            print(f"Error extracting eye features: {str(e)}")
            return None
    
    def _get_eye_region(self, landmarks, side):
        """Extract eye region from facial landmarks"""
        try:
            if side == "left":
                points = range(36, 42)
            else:
                points = range(42, 48)
                
            eye_points = [(landmarks.part(i).x, landmarks.part(i).y) for i in points]
            return np.array(eye_points)
        except:
            return None
    
    def _process_eye(self, eye_region, gray_frame):
        """Process a single eye region to extract features"""
        try:
            # Get eye bounding box
            x, y, w, h = cv2.boundingRect(eye_region)
            eye_roi = gray_frame[y:y+h, x:x+w]
            
            # Calculate eye openness
            openness = h / w
            
            # Detect pupil
            pupil_pos = self._detect_pupil(eye_roi)
            if pupil_pos is None:
                return None
                
            # Calculate gaze angle
            center = (w/2, h/2)
            gaze_angle = np.arctan2(pupil_pos[1] - center[1], pupil_pos[0] - center[0])
            
            # Detect blink
            is_blinking = openness < self.blink_threshold
            
            return {
                'pupil_pos': pupil_pos,
                'gaze_angle': gaze_angle,
                'is_blinking': is_blinking,
                'openness': openness
            }
        except:
            return None
    
    def _detect_pupil(self, eye_roi):
        """Detect pupil position in eye region"""
        try:
            # Apply thresholding
            _, thresh = cv2.threshold(eye_roi, 30, 255, cv2.THRESH_BINARY_INV)
            
            # Find contours
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            if not contours:
                return None
                
            # Get largest contour (pupil)
            pupil_contour = max(contours, key=cv2.contourArea)
            M = cv2.moments(pupil_contour)
            
            if M["m00"] != 0:
                cx = int(M["m10"] / M["m00"])
                cy = int(M["m01"] / M["m00"])
                return (cx, cy)
            return None
        except:
            return None
    
    def get_adhd_features(self):
        """Extract ADHD-relevant features from the tracking session"""
        if len(self.pupil_positions) < self.min_frames_for_analysis:
            return None
            
        # Convert to numpy arrays for calculations
        pupil_positions = np.array(self.pupil_positions)
        gaze_angles = np.array(self.gaze_angles)
        
        # Calculate movement features
        pupil_movement = np.diff(pupil_positions, axis=0)
        gaze_changes = np.diff(gaze_angles)
        
        # Calculate ADHD-relevant features
        features = {
            # Blinking features
            'blink_rate': self.blink_count / self.frame_count,
            'blink_duration': self.blink_count,
            
            # Movement features
            'pupil_speed_mean': np.mean(np.linalg.norm(pupil_movement, axis=1)),
            'pupil_speed_std': np.std(np.linalg.norm(pupil_movement, axis=1)),
            'pupil_speed_max': np.max(np.linalg.norm(pupil_movement, axis=1)),
            
            # Gaze stability features
            'gaze_angle_mean': np.mean(gaze_angles),
            'gaze_angle_std': np.std(gaze_angles),
            'gaze_angle_range': np.ptp(gaze_angles),
            
            # Saccade features
            'saccade_count': np.sum(np.abs(gaze_changes) > self.saccade_threshold),
            'saccade_amplitude_mean': np.mean(np.abs(gaze_changes)),
            'saccade_amplitude_std': np.std(np.abs(gaze_changes)),
            
            # Fixation features
            'fixation_duration_mean': self._calculate_fixation_duration(pupil_movement),
            'fixation_duration_std': self._calculate_fixation_std(pupil_movement)
        }
        
        return features
    
    def _calculate_fixation_duration(self, movements):
        """Calculate average fixation duration"""
        # Consider points with small movement as fixations
        fixation_mask = np.linalg.norm(movements, axis=1) < self.saccade_threshold
        fixation_durations = []
        current_duration = 0
        
        for is_fixation in fixation_mask:
            if is_fixation:
                current_duration += 1
            else:
                if current_duration > 0:
                    fixation_durations.append(current_duration)
                current_duration = 0
                
        if current_duration > 0:
            fixation_durations.append(current_duration)
            
        return np.mean(fixation_durations) if fixation_durations else 0
    
    def _calculate_fixation_std(self, movements):
        """Calculate standard deviation of fixation durations"""
        fixation_mask = np.linalg.norm(movements, axis=1) < self.saccade_threshold
        fixation_durations = []
        current_duration = 0
        
        for is_fixation in fixation_mask:
            if is_fixation:
                current_duration += 1
            else:
                if current_duration > 0:
                    fixation_durations.append(current_duration)
                current_duration = 0
                
        if current_duration > 0:
            fixation_durations.append(current_duration)
            
        return np.std(fixation_durations) if fixation_durations else 0
    
    def reset(self):
        """Reset tracking variables for new session"""
        self.frame_count = 0
        self.blink_count = 0
        self.pupil_positions = []
        self.gaze_angles = []
        self.eyes_detected = False 