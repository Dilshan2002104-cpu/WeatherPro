# Weather AI Assistant - Python Backend

AI-powered weather chatbot using Google Vertex AI Gemini 2.0 Flash.

## Setup

### 1. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Google Cloud

1. Create a Google Cloud project
2. Enable Vertex AI API
3. Create a service account with "Vertex AI User" role
4. Download the service account key JSON file
5. Copy `.env.example` to `.env` and update:
   - `GOOGLE_APPLICATION_CREDENTIALS`: Path to your service account key
   - `GOOGLE_CLOUD_PROJECT`: Your GCP project ID
   - `GOOGLE_CLOUD_LOCATION`: Region (e.g., us-central1)

### 4. Run the Server
```bash
python main.py
```

Server will start on `http://localhost:8000`

## API Endpoints

### POST /api/chat
Send a message to the AI assistant.

**Request:**
```json
{
  "session_id": "unique-session-id",
  "message": "Will I need an umbrella today?",
  "city": "Colombo",
  "include_forecast": true
}
```

**Response:**
```json
{
  "session_id": "unique-session-id",
  "message": "Will I need an umbrella today?",
  "response": "Based on current weather in Colombo..."
}
```

### POST /api/chat/clear/{session_id}
Clear chat history for a session.

### GET /health
Health check endpoint.

## Development

- FastAPI auto-generates API docs at `/docs`
- Interactive API testing at `/redoc`
