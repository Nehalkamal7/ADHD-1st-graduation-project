import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
import json
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class FeatureAnalyzer:
    def __init__(self, model_path: str = 'models/adhd_detection_model.h5'):
        """
        Initialize the feature analyzer with a trained model.
        
        Args:
            model_path: Path to the trained model file
        """
        try:
            # Load model
            self.model = tf.keras.models.load_model(model_path)
            logger.info(f"Loaded model from {model_path}")
            
            # Load model info and scaler parameters
            with open('models/model_info.json', 'r') as f:
                model_info = json.load(f)
                self.feature_names = model_info['feature_names']
                
                # Initialize scaler
                self.scaler = StandardScaler()
                self.scaler.mean_ = np.array(model_info['scaler_mean'])
                self.scaler.scale_ = np.array(model_info['scaler_scale'])
                
            logger.info("Loaded model info and scaler parameters")
            
        except Exception as e:
            logger.error(f"Error initializing feature analyzer: {str(e)}")
            raise
            
    def analyze_features(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze features and make prediction using the trained model.
        
        Args:
            features: Dictionary containing extracted features
            
        Returns:
            Dictionary containing prediction results
        """
        try:
            # Convert features to array in correct order
            X = np.array([[features[name] for name in self.feature_names]])
            
            # Scale features
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            prediction = self.model.predict(X_scaled)[0][0]
            
            # Calculate confidence
            confidence = abs(prediction - 0.5) * 2  # Convert to 0-1 range
            
            # Determine ADHD likelihood
            if prediction >= 0.7:
                likelihood = "High"
            elif prediction >= 0.4:
                likelihood = "Moderate"
            else:
                likelihood = "Low"
                
            result = {
                'prediction': float(prediction),
                'confidence': float(confidence),
                'likelihood': likelihood,
                'features': features
            }
            
            logger.info(f"Analysis completed - Prediction: {prediction:.3f}, Likelihood: {likelihood}")
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing features: {str(e)}")
            raise 