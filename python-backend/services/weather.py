import httpx
from typing import Optional, Dict, Any
import os

class WeatherService:
    def __init__(self):
        self.go_backend_url = os.getenv("GO_BACKEND_URL", "http://localhost:8080")
    
    async def get_current_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """Fetch current weather from Go backend"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.go_backend_url}/api/weather",
                    params={"city": city},
                    timeout=10.0
                )
                response.raise_for_status()
                return response.json()
            except Exception as e:
                print(f"Error fetching weather: {e}")
                return None
    
    async def get_forecast(self, city: str) -> Optional[Dict[str, Any]]:
        """Fetch 5-day forecast from Go backend"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.go_backend_url}/api/forecast",
                    params={"city": city},
                    timeout=10.0
                )
                response.raise_for_status()
                return response.json()
            except Exception as e:
                print(f"Error fetching forecast: {e}")
                return None
