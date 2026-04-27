from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import uuid
import shutil
import logging
from datetime import datetime
from result_finder.process_video import VideoProcessor
from result_finder.analyze_features import FeatureAnalyzer
from result_finder.utils import combine_assessment_results, save_results

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
origins = [
    "https://hazq.aazsol.com",
    "http://hazq.aazsol.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Initialize processors
video_processor = VideoProcessor()
feature_analyzer = FeatureAnalyzer()

# Create uploads directory structure
UPLOAD_DIR = 'uploads'
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_video_path():
    # Create date-based directory structure
    today = datetime.now()
    year_dir = os.path.join(UPLOAD_DIR, str(today.year))
    month_dir = os.path.join(year_dir, f"{today.month:02d}")
    day_dir = os.path.join(month_dir, f"{today.day:02d}")
    
    # Create directories if they don't exist
    os.makedirs(day_dir, exist_ok=True)
    return day_dir

@app.post("/api/process-assessment")
async def process_assessment(
    questionnaire_score: int = Form(...),
    video: UploadFile = File(..., max_size=100 * 1024 * 1024)  # 100MB max size
):
    try:
        logger.info(f"Received assessment request with questionnaire score: {questionnaire_score}")
        
        # Validate questionnaire score
        if not isinstance(questionnaire_score, int) or questionnaire_score < 0 or questionnaire_score > 144:
            raise HTTPException(status_code=400, detail="Invalid questionnaire score. Must be between 0 and 144.")
        
        # Generate unique filename with timestamp
        file_extension = os.path.splitext(video.filename)[1]
        if file_extension.lower() not in ['.mp4', '.avi', '.mov', '.webm']:
            raise HTTPException(status_code=400, detail="Invalid file format. Supported formats: MP4, AVI, MOV, WebM")
            
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_filename = f"{timestamp}_{uuid.uuid4()}{file_extension}"
        
        # Get the appropriate directory path and create full file path
        video_dir = get_video_path()
        file_path = os.path.join(video_dir, unique_filename)
        
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
        
        logger.info(f"Video saved to {file_path}")
        
        try:
            # Process video
            features = video_processor.process_video(file_path)
            logger.info("Video processed successfully")
            
            # Analyze features
            video_results = feature_analyzer.analyze_features(features)
            logger.info("Features analyzed successfully")
            
            # Combine results
            assessment_results = combine_assessment_results(video_results, questionnaire_score)
            logger.info("Assessment results combined successfully")
            
            # Save results and include video path
            assessment_results['video_path'] = file_path
            save_results(assessment_results)
            
            return assessment_results
            
        except Exception as e:
            logger.error(f"Error processing video: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        
    except HTTPException as he:
        logger.error(f"HTTP error in process_assessment: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Error in process_assessment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 