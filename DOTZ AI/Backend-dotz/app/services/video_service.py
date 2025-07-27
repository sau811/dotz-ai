import cv2
from app.models.video_model import process_frame, generate_text_response

def handle_video_stream(video_path: str):
    """Process video frames and provide real-time AI responses."""
    cap = cv2.VideoCapture(video_path)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
from fastapi import APIRouter, UploadFile, File
from app.services.video_service import handle_video_stream

router = APIRouter(prefix="/video", tags=["Video"])

@router.post("/")
async def process_uploaded_video(file: UploadFile = File(...)):
    """Process an uploaded video file."""
    try:
        video_path = f"temp_{file.filename}"  # Temporary file name
        with open(video_path, "wb") as f:
            f.write(await file.read())
        analysis_result = handle_video_stream(video_path)
        os.remove(video_path)  # Clean up temporary file
        return {"analysis": analysis_result}
    except Exception as e:
        return {"error": str(e)}
        # Process the frame for object & sign detection
        processed_frame = process_frame(frame)

        # AI-generated response
        ai_response = generate_text_response("Describe the detected objects and actions.")

        # Display AI response on frame
        cv2.putText(processed_frame, ai_response, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

        cv2.imshow("AI Video Assistant", processed_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
