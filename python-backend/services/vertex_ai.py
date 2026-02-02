import vertexai
from vertexai.generative_models import GenerativeModel, ChatSession
from typing import Optional, Dict
import os

class VertexAIService:
    def __init__(self):
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        location = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
        
        vertexai.init(project=project_id, location=location)
        self.model = GenerativeModel("gemini-2.0-flash-exp")
        self.chat_sessions: Dict[str, ChatSession] = {}
    
    def get_or_create_session(self, session_id: str) -> ChatSession:
        """Get existing chat session or create new one"""
        if session_id not in self.chat_sessions:
            self.chat_sessions[session_id] = self.model.start_chat()
        return self.chat_sessions[session_id]
    
    async def send_message(
        self, 
        session_id: str, 
        message: str, 
        system_instruction: Optional[str] = None
    ) -> str:
        """Send message to Gemini and get response"""
        chat = self.get_or_create_session(session_id)
        
        # Add system instruction if provided
        if system_instruction:
            full_message = f"{system_instruction}\n\nUser: {message}"
        else:
            full_message = message
        
        response = chat.send_message(full_message)
        return response.text
    
    def clear_session(self, session_id: str):
        """Clear chat history for a session"""
        if session_id in self.chat_sessions:
            del self.chat_sessions[session_id]
