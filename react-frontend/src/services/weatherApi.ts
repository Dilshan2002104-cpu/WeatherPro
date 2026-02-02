import type { WeatherData, WeatherError } from '../types/weather';
import type { ForecastData } from '../types/forecast';


const API_BASE_URL = 'http://localhost:8080';

export const fetchWeather = async (city: string): Promise<WeatherData> => {
    const response = await fetch(`${API_BASE_URL}/api/weather?city=${encodeURIComponent(city)}`);

    if (!response.ok) {
        const errorData: WeatherError = await response.json();
        throw new Error(errorData.error || 'Failed to fetch weather data');
    }

    return response.json();
};

// Fetch weather directly from Open-Meteo using coordinates (bypass backend)
export const fetchWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherData> => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    // Transform to match our WeatherData interface
    return {
        latitude: data.latitude,
        longitude: data.longitude,
        current: {
            time: data.current.time,
            temperature_2m: data.current.temperature_2m,
            relative_humidity_2m: data.current.relative_humidity_2m,
            weather_code: data.current.weather_code,
        },
    };
};

// Fetch 5-day forecast from backend
export const fetchForecast = async (city: string): Promise<ForecastData> => {
    const response = await fetch(`${API_BASE_URL}/api/forecast?city=${encodeURIComponent(city)}`);

    if (!response.ok) {
        const errorData: WeatherError = await response.json();
        throw new Error(errorData.error || 'Failed to fetch forecast data');
    }

    return response.json();
};
