# 🌦️ WeatherPro - AI-Powered Weather Application

A modern, full-stack weather application featuring real-time weather data, 5-day forecasts with interactive charts, and an AI-powered chatbot assistant built with Google Vertex AI Gemini 2.0 Flash.

![Dark Mode Premium Design](https://img.shields.io/badge/Design-Dark%20Mode%20Premium-00d4ff?style=for-the-badge)
![Go](https://img.shields.io/badge/Go-1.20+-00ADD8?style=for-the-badge&logo=go)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)

## ✨ Features

### 🌡️ Current Weather
- Real-time weather data for Sri Lankan cities
- Temperature, humidity, and weather conditions
- City search with autocomplete
- Geolocation support ("Use My Location")
- Beautiful dark mode UI with neon cyan accents

### 📊 5-Day Forecast
- Daily weather predictions
- Interactive temperature trend charts (area chart)
- Precipitation visualization (bar chart)
- Tabbed interface for easy navigation
- Dark theme with cyan/purple gradients

### 🤖 AI Weather Assistant
- Natural language weather queries
- Context-aware responses using current weather data
- Conversation memory across messages
- Suggested prompts for quick questions
- Powered by Google Vertex AI Gemini 2.0 Flash

### 🎨 Dark Mode Premium Design
- Deep dark backgrounds (#0a0e27, #1a1d2e)
- Neon cyan accent color (#00d4ff)
- Glassmorphism-inspired cards
- Smooth animations and transitions
- Professional header and footer

## 🏗️ Architecture

```
┌─────────────────────┐
│   React Frontend    │
│  (TypeScript + UI)  │
└──────────┬──────────┘
           │
           ├──────────► Go Backend (Weather API)
           │            └─► Open-Meteo API
           │            └─► Nominatim Geocoding
           │
           └──────────► Python Backend (AI Chatbot)
                        └─► Vertex AI Gemini 2.0 Flash
                        └─► Go Backend (Weather Data)
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Vite** for build tooling

### Backend - Weather API
- **Go 1.20+** with Gin framework
- **Open-Meteo API** for weather data
- **Nominatim API** for geocoding
- In-memory caching

### Backend - AI Chatbot
- **Python 3.9+** with FastAPI
- **Google Vertex AI** (Gemini 2.0 Flash)
- **Uvicorn** ASGI server
- Context injection with weather data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Go 1.20+
- Python 3.9+
- Google Cloud account (for AI features)

### 1. Clone the Repository
```bash
git clone https://github.com/Dilshan2002104-cpu/go-weather-api.git
cd go-weather-api
```

### 2. Start Go Backend (Weather API)
```bash
cd go-backend
go run .
# Runs on http://localhost:8080
```

### 3. Start React Frontend
```bash
cd react-frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 4. Start Python AI Backend (Optional)
```bash
cd python-backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (see AI Setup below)
cp .env.example .env
# Edit .env with your credentials

# Run server
python3 main.py
# Runs on http://localhost:8000
```

## 🔐 Google Cloud Vertex AI Setup (For AI Chatbot)

### Step 1: Create GCP Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note your Project ID

### Step 2: Enable Vertex AI API
1. Navigate to **APIs & Services > Library**
2. Search for "Vertex AI API"
3. Click **Enable**

### Step 3: Create Service Account
1. Go to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Name: `weather-ai-assistant`
4. Grant role: **Vertex AI User**
5. Click **Done**

### Step 4: Create and Download Key
1. Click on the service account
2. Go to **Keys** tab
3. Click **Add Key > Create new key**
4. Choose **JSON** format
5. Download and save the key file

### Step 5: Configure Environment
Create `.env` file in `python-backend/`:
```env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GO_BACKEND_URL=http://localhost:8080
PORT=8000
```

## 📖 Usage

### Search for Weather
1. Open the app at `http://localhost:5173`
2. Type a city name in the search bar
3. Select from autocomplete suggestions
4. View current weather and forecast

### Use Geolocation
1. Click **"Use My Location"** button
2. Allow location access when prompted
3. Weather data for your location will load

### Chat with AI Assistant
1. Search for a city first
2. Click the **"🤖 AI Assistant"** tab
3. Ask questions like:
   - "Will I need an umbrella today?"
   - "What should I wear tomorrow?"
   - "Is it good weather for outdoor activities?"
   - "Explain today's weather pattern"

## 📁 Project Structure

```
weather-api/
├── go-backend/              # Go weather API
│   ├── api/                 # HTTP handlers
│   ├── models/              # Data models
│   ├── services/            # Business logic
│   └── main.go
│
├── python-backend/          # Python AI chatbot
│   ├── services/            # Vertex AI & weather services
│   ├── models/              # Pydantic models
│   ├── prompts/             # AI system prompts
│   └── main.py
│
└── react-frontend/          # React web app
    ├── src/
    │   ├── components/      # React components
    │   ├── services/        # API clients
    │   ├── types/           # TypeScript types
    │   ├── utils/           # Utility functions
    │   └── hooks/           # Custom React hooks
    └── public/
```

## 🎯 API Endpoints

### Go Backend (Port 8080)

#### Get Current Weather
```bash
GET /api/weather?city=Colombo
```

#### Get 5-Day Forecast
```bash
GET /api/forecast?city=Colombo
```

### Python Backend (Port 8000)

#### Chat with AI
```bash
POST /api/chat
Content-Type: application/json

{
  "session_id": "unique-session-id",
  "message": "Will I need an umbrella today?",
  "city": "Colombo",
  "include_forecast": true
}
```

#### Clear Chat History
```bash
POST /api/chat/clear/{session_id}
```

#### API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🎨 Design Philosophy

**Dark Mode Premium** aesthetic inspired by modern SaaS dashboards:
- High contrast for readability
- Neon accents used strategically
- Professional yet modern
- Clean, organized layouts
- Smooth, purposeful animations

### Color Palette
- **Primary Background**: `#0a0e27` (Deep navy)
- **Card Background**: `#1a1d2e`
- **Accent Cyan**: `#00d4ff`
- **Accent Purple**: `#a855f7`
- **Accent Pink**: `#ec4899`

## 🧪 Testing

### Manual Testing Checklist
- ✅ Current weather search works
- ✅ Geolocation feature works
- ✅ Autocomplete suggestions appear
- ✅ 5-day forecast displays correctly
- ✅ Temperature chart renders
- ✅ Precipitation chart renders
- ✅ Tab switching works smoothly
- ✅ AI chatbot responds (requires Vertex AI setup)
- ✅ Responsive on mobile devices

## 🔮 Future Enhancements

- [ ] Streaming AI responses (real-time tokens)
- [ ] Voice input for queries
- [ ] Weather alerts and notifications
- [ ] Historical weather data
- [ ] Multi-language support (i18n)
- [ ] User preferences (save favorite cities)
- [ ] Weather maps with overlays
- [ ] Social sharing features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Open-Meteo** - Free weather API
- **Nominatim** - Geocoding service
- **Google Vertex AI** - Gemini 2.0 Flash
- **Recharts** - React charting library
- **Tailwind CSS** - Utility-first CSS framework

## 📧 Contact

Dilshan - [@Dilshan2002104-cpu](https://github.com/Dilshan2002104-cpu)

Project Link: [https://github.com/Dilshan2002104-cpu/go-weather-api](https://github.com/Dilshan2002104-cpu/go-weather-api)

---

**Built with ❤️ using Go, React, Python, and AI**
