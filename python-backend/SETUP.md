# Python Backend Setup Guide

## Quick Setup (Ubuntu/Linux)

### 1. Create Virtual Environment
```bash
cd python-backend
python3 -m venv venv
```

### 2. Activate Virtual Environment
```bash
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env` and add your Google Cloud credentials:
```env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GO_BACKEND_URL=http://localhost:8080
PORT=8000
```

### 5. Run the Server
```bash
python3 main.py
```

The server will start on `http://localhost:8000`

## Testing Without Vertex AI

If you want to test the frontend integration without setting up Vertex AI yet, you can create a mock endpoint. The chatbot UI will work, but you'll need to configure Vertex AI for actual AI responses.

## Google Cloud Vertex AI Setup

### Step 1: Create GCP Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note your Project ID

### Step 2: Enable Vertex AI API
1. Go to APIs & Services > Library
2. Search for "Vertex AI API"
3. Click Enable

### Step 3: Create Service Account
1. Go to IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Name: `weather-ai-assistant`
4. Click "Create and Continue"
5. Grant role: "Vertex AI User"
6. Click "Done"

### Step 4: Create Key
1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose JSON format
5. Download the key file
6. Save it securely (e.g., `~/gcp-keys/weather-ai-key.json`)

### Step 5: Update .env
```env
GOOGLE_APPLICATION_CREDENTIALS=/home/dilshan/gcp-keys/weather-ai-key.json
GOOGLE_CLOUD_PROJECT=your-actual-project-id
GOOGLE_CLOUD_LOCATION=us-central1
```

## Troubleshooting

### Python command not found
Use `python3` instead of `python`:
```bash
python3 -m venv venv
python3 main.py
```

### Permission denied on venv/bin/activate
```bash
chmod +x venv/bin/activate
source venv/bin/activate
```

### Module not found errors
Make sure virtual environment is activated:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Vertex AI authentication errors
1. Check that GOOGLE_APPLICATION_CREDENTIALS path is correct
2. Verify the JSON key file exists
3. Ensure Vertex AI API is enabled in your project
4. Confirm service account has "Vertex AI User" role

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Example API Call

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-123",
    "message": "Will I need an umbrella today?",
    "city": "Colombo",
    "include_forecast": true
  }'
```

## Deactivate Virtual Environment

When done:
```bash
deactivate
```
