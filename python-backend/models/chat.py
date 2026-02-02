from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    session_id: str
    message: str
    city: Optional[str] = None
    include_forecast: bool = False

class ChatResponse(BaseModel):
    session_id: str
    message: str
    response: str
    
class ClearSessionResponse(BaseModel):
    message: str
    session_id: str
