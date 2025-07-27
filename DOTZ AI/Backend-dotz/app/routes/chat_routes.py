# app/routes/chat_routes.py
from fastapi import WebSocket, APIRouter, WebSocketDisconnect
import logging
import json
from app.services.chat_service import process_chat, ChatRequest

# Logger Configuration
logger = logging.getLogger(__name__)

# Create Router
router = APIRouter()

@router.websocket("/ws")
async def websocket_chat(websocket: WebSocket):
    logger.info(f"Attempting to accept connection from {websocket.client}")
    try:
        await websocket.accept()
        logger.info(f"Connection accepted: {websocket.client}")
        while True:
            try:
                # Receive message
                data = await websocket.receive_text()
                logger.info(f"Received WebSocket Message: {data}")

                # Parse JSON
                try:
                    data_dict = json.loads(data)
                except json.JSONDecodeError as e:
                    logger.error(f"Invalid JSON received: {data} - Error: {str(e)}")
                    await websocket.send_json({"message": "Invalid JSON format."})
                    continue  # Skip processing this message

                # Extract message and user_id
                message = data_dict.get("message", "").strip()
                user_id = data_dict.get("user_id")

                if not user_id:
                    logger.warning("Missing user_id in request")
                    await websocket.send_json({"message": "User ID is required."})
                    continue

                if not message:
                    logger.warning("Empty message received")
                    await websocket.send_json({"message": "I didn't understand that."})
                    continue

                # Process chat request
                logger.info(f"Processing Chat for user {user_id}: {message}")
                response = await process_chat(ChatRequest(user_id=user_id, message=message))
                logger.info(f"Bot Reply to {user_id}: {response}")

                # Send response
                await websocket.send_json({"message": response})

            except WebSocketDisconnect:
                logger.info(f"WebSocket disconnected: {websocket.client}")
                break  # Exit loop
            except Exception as e:
                logger.exception("Unexpected error occurred")
                await websocket.send_json({"message": "An internal error occurred."})

    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        logger.info(f"Closing WebSocket connection: {websocket.client}")
        await websocket.close()