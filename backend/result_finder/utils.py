import os
import logging
from typing import Dict, Any
import json
from datetime import datetime

logger = logging.getLogger(__name__)

def save_results(results: Dict[str, Any], output_dir: str = 'results') -> str:
    """
    Save analysis results to a JSON file.
    
    Args:
        results: Dictionary containing analysis results
        output_dir: Directory to save results in
        
    Returns:
        Path to the saved results file
    """
    try:
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"analysis_results_{timestamp}.json"
        filepath = os.path.join(output_dir, filename)
        
        # Save results
        with open(filepath, 'w') as f:
            json.dump(results, f, indent=4)
            
        logger.info(f"Results saved to {filepath}")
        return filepath
        
    except Exception as e:
        logger.error(f"Error saving results: {str(e)}")
        raise

def combine_assessment_results(
    video_results: Dict[str, Any],
    questionnaire_score: int
) -> Dict[str, Any]:
    """
    Combine video analysis results with questionnaire score.
    
    Args:
        video_results: Results from video analysis
        questionnaire_score: Score from ADHD questionnaire
        
    Returns:
        Combined assessment results
    """
    try:
        # Calculate questionnaire results
        percentage = (questionnaire_score / 144) * 100
        if percentage >= 75:
            q_likelihood = "High"
        elif percentage >= 50:
            q_likelihood = "Moderate"
        else:
            q_likelihood = "Low"
            
        questionnaire_results = {
            "raw_score": questionnaire_score,
            "percentage": round(percentage, 2),
            "likelihood": q_likelihood
        }
        
        # Calculate final assessment
        questionnaire_weight = 0.6
        video_weight = 0.4
        
        # Convert questionnaire likelihood to score
        q_score = 1.0 if q_likelihood == "High" else (0.5 if q_likelihood == "Moderate" else 0.0)
        v_score = video_results['prediction']
        
        final_score = (q_score * questionnaire_weight) + (v_score * video_weight)
        
        if final_score >= 0.7:
            final_likelihood = "High"
        elif final_score >= 0.4:
            final_likelihood = "Moderate"
        else:
            final_likelihood = "Low"
            
        return {
            "questionnaire_results": questionnaire_results,
            "video_results": {
                'prediction': 'ADHD' if v_score >= 0.5 else 'No ADHD',
                'probability': v_score,
                'confidence': video_results['confidence'],
                'likelihood': video_results['likelihood']
            },
            "final_score": round(final_score * 100, 2),
            "final_likelihood": final_likelihood,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error combining assessment results: {str(e)}")
        raise 