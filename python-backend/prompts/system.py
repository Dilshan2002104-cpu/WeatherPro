def get_system_prompt(weather_data: dict = None, forecast_data: dict = None) -> str:
    """Generate system prompt with weather context"""
    
    base_prompt = """You are a friendly and knowledgeable AI weather assistant for Sri Lanka. 
Your role is to help users understand weather conditions and make informed decisions.

Guidelines:
- Be conversational, warm, and helpful
- Provide specific, actionable advice
- Use emojis to make responses engaging (but not excessively)
- Keep responses concise but informative (2-4 sentences usually)
- If asked about weather you don't have data for, politely say so
- Suggest activities appropriate for the weather conditions
- Explain weather patterns in simple, easy-to-understand terms
- Consider Sri Lankan context (tropical climate, monsoons, etc.)
- Be proactive in warning about extreme conditions
"""

    if weather_data:
        current = weather_data.get("current", {})
        temp = current.get("temperature_2m", "N/A")
        humidity = current.get("relative_humidity_2m", "N/A")
        weather_code = current.get("weather_code", 0)
        
        # Map weather codes to descriptions
        weather_desc = get_weather_description(weather_code)
        
        base_prompt += f"""

CURRENT WEATHER DATA AVAILABLE:
- Temperature: {temp}°C
- Humidity: {humidity}%
- Conditions: {weather_desc}
- Location: Latitude {weather_data.get('latitude')}, Longitude {weather_data.get('longitude')}
"""

    if forecast_data:
        daily = forecast_data.get("daily", {})
        times = daily.get("time", [])
        max_temps = daily.get("temperature_2m_max", [])
        min_temps = daily.get("temperature_2m_min", [])
        precip = daily.get("precipitation_sum", [])
        
        base_prompt += "\n\n5-DAY FORECAST DATA AVAILABLE:\n"
        for i, date in enumerate(times[:5]):
            base_prompt += f"- {date}: High {max_temps[i]:.1f}°C, Low {min_temps[i]:.1f}°C"
            if precip[i] > 0:
                base_prompt += f", Rain: {precip[i]:.1f}mm"
            base_prompt += "\n"
    
    base_prompt += """

Remember: Use this data to provide helpful, context-aware responses. If the user asks about specific conditions, reference the actual data provided above.
"""
    
    return base_prompt


def get_weather_description(code: int) -> str:
    """Map WMO weather codes to descriptions"""
    weather_codes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    }
    return weather_codes.get(code, "Unknown")
