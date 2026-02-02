from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.chat import ChatRequest, ChatResponse, ClearSessionResponse
from services.vertex_ai import VertexAIService
from services.weather import WeatherService
from prompts.system import get_system_prompt
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Weather AI Assistant API",
    description="AI-powered weather chatbot using Google Vertex AI Gemini 2.0 Flash",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
vertex_ai = VertexAIService()
weather_service = WeatherService()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Weather AI Assistant API",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/chat",
            "clear": "/api/chat/clear/{session_id}",
            "health": "/health"
        }
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint with weather context
    
    - **session_id**: Unique session identifier for conversation memory
    - **message**: User's message/question
    - **city**: Optional city name to fetch weather data
    - **include_forecast**: Whether to include 5-day forecast in context
    """
    try:
        # Fetch weather data if city provided
        weather_data = None
        forecast_data = None
        
        if request.city:
            weather_data = await weather_service.get_current_weather(request.city)
            if request.include_forecast:
                forecast_data = await weather_service.get_forecast(request.city)
        
        # Generate system prompt with context
        system_instruction = get_system_prompt(weather_data, forecast_data)
        
        # Get AI response
        response = await vertex_ai.send_message(
            session_id=request.session_id,
            message=request.message,
            system_instruction=system_instruction
        )
        
        return ChatResponse(
            session_id=request.session_id,
            message=request.message,
            response=response
        )
    
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to process chat message: {str(e)}"
        )

@app.post("/api/chat/clear/{session_id}", response_model=ClearSessionResponse)
async def clear_chat(session_id: str):
    """Clear chat history for a specific session"""
    try:
        vertex_ai.clear_session(session_id)
        return ClearSessionResponse(
            message="Chat history cleared successfully",
            session_id=session_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to clear chat history: {str(e)}"
        )

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Weather AI Assistant",
        "vertex_ai": "connected" if vertex_ai else "disconnected"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port,
        log_level="info"
    )
