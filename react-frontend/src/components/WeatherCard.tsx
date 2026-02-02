import { useState, useRef, useEffect } from 'react';
import { fetchWeather, fetchWeatherByCoordinates, fetchForecast } from '../services/weatherApi';
import { searchCities } from '../services/geocodingApi';
import { getCurrentPosition } from '../services/geolocationService';
import type { WeatherData } from '../types/weather';
import type { GeocodingResult } from '../types/geocoding';
import type { ForecastData } from '../types/forecast';
import { ForecastCard } from './ForecastCard';
import { ChatBot } from './ChatBot';

import { getWeatherInfo } from '../utils/weatherCodes';
import { useDebounce } from '../hooks/useDebounce';

export const WeatherCard = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Geolocation state
    const [gettingLocation, setGettingLocation] = useState(false);

    // Forecast state
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [showForecast, setShowForecast] = useState(false);
    const [loadingForecast, setLoadingForecast] = useState(false);

    // Chat state
    const [showChat, setShowChat] = useState(false);

    // Autocomplete states
    const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounced search for city suggestions
    const debouncedSearch = useDebounce(async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        try {
            const data = await searchCities(query);
            setSuggestions(data.results || []);
            setShowSuggestions(true);
        } catch (err) {
            console.error('Failed to fetch suggestions:', err);
            setSuggestions([]);
        }
    }, 300);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCity(value);
        debouncedSearch(value);
        setSelectedIndex(-1);
    };

    // Handle city selection from dropdown
    const handleSelectCity = (suggestion: GeocodingResult) => {
        setCity(suggestion.name);
        setShowSuggestions(false);
        setSuggestions([]);
        fetchWeatherData(suggestion.name);
        fetchForecastData(suggestion.name);
    };

    // Fetch weather data
    const fetchWeatherData = async (cityName: string) => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchWeather(cityName);
            setWeather(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch weather');
            setWeather(null);
        } finally {
            setLoading(false);
        }
    };

    // Fetch forecast data
    const fetchForecastData = async (cityName: string) => {
        setLoadingForecast(true);
        try {
            const data = await fetchForecast(cityName);
            setForecast(data);
        } catch (err) {
            console.error('Failed to fetch forecast:', err);
            setForecast(null);
        } finally {
            setLoadingForecast(false);
        }
    };

    // Handle "Use My Location" button
    const handleUseLocation = async () => {
        setGettingLocation(true);
        setError(null);

        try {
            const position = await getCurrentPosition();
            const data = await fetchWeatherByCoordinates(position.latitude, position.longitude);
            setWeather(data);
            setCity('Current Location');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get location');
        } finally {
            setGettingLocation(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city.trim()) return;

        setShowSuggestions(false);
        fetchWeatherData(city);
        fetchForecastData(city);
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleSelectCity(suggestions[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const weatherInfo = weather ? getWeatherInfo(weather.current.weather_code) : null;

    return (
        <div className="card-dark p-8 max-w-2xl mx-auto animate-slide-up">
            {/* Title */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Weather Search</h2>
                <p className="text-[var(--text-secondary)]">Get current weather for any city in Sri Lanka</p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6 relative">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={city}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Search for a city..."
                        className="input-dark w-full pr-12"
                    />
                    <button
                        type="submit"
                        disabled={loading || !city.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--accent-cyan)] hover:text-[#00b8e6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div
                        ref={dropdownRef}
                        className="absolute z-10 w-full mt-2 card-dark-elevated max-h-60 overflow-y-auto"
                    >
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={`${suggestion.latitude}-${suggestion.longitude}`}
                                type="button"
                                onClick={() => handleSelectCity(suggestion)}
                                className={`w-full text-left px-4 py-3 transition-all duration-200 ${index === selectedIndex
                                    ? 'bg-[var(--accent-cyan)]/20 border-l-2 border-[var(--accent-cyan)]'
                                    : 'hover:bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                <div className="text-white font-medium">{suggestion.name}</div>
                                <div className="text-xs text-[var(--text-secondary)]">
                                    {suggestion.admin1}, {suggestion.country}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </form>

            {/* Loading Indicator */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-[var(--bg-tertiary)] border-t-[var(--accent-cyan)] rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-[var(--accent-cyan)] rounded-full animate-pulse-glow"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Use My Location Button */}
            <button
                onClick={handleUseLocation}
                disabled={gettingLocation}
                className="btn-outline w-full mb-6 flex items-center justify-center gap-2"
            >
                {gettingLocation ? (
                    <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Getting your location...
                    </>
                ) : (
                    <>
                        📍 Use My Location
                    </>
                )}
            </button>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-[var(--accent-pink)]/10 border border-[var(--accent-pink)]/30 animate-fade-in">
                    <p className="text-[var(--accent-pink)] text-center flex items-center justify-center gap-2">
                        <span>❌</span> {error}
                    </p>
                </div>
            )}

            {/* Toggle Buttons */}
            {weather && (
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => { setShowForecast(false); setShowChat(false); }}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${!showForecast && !showChat
                            ? 'bg-[var(--accent-cyan)] text-[#0a0e27] shadow-lg glow-cyan'
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-input)]'
                            }`}
                    >
                        Current Weather
                    </button>
                    <button
                        onClick={() => { setShowForecast(true); setShowChat(false); }}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${showForecast && !showChat
                            ? 'bg-[var(--accent-cyan)] text-[#0a0e27] shadow-lg glow-cyan'
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-input)]'
                            }`}
                    >
                        5-Day Forecast
                    </button>
                    <button
                        onClick={() => { setShowForecast(false); setShowChat(true); }}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${showChat
                            ? 'bg-[var(--accent-cyan)] text-[#0a0e27] shadow-lg glow-cyan'
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-input)]'
                            }`}
                    >
                        🤖 AI Assistant
                    </button>
                </div>
            )}

            {/* Current Weather Display */}
            {weather && weatherInfo && !showForecast && !showChat && (
                <div className="space-y-6 animate-fade-in">
                    {/* Main Weather Info */}
                    <div className="text-center py-8">
                        <div className="text-8xl mb-6 animate-pulse-slow">
                            {weatherInfo.emoji}
                        </div>
                        <h2 className="text-6xl font-bold text-gradient-cyan mb-4">
                            {Math.round(weather.current.temperature_2m)}°C
                        </h2>
                        <p className="text-2xl text-white mb-2">
                            {weatherInfo.description}
                        </p>
                        <p className="text-[var(--text-secondary)]">
                            {city.charAt(0).toUpperCase() + city.slice(1)}
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="card-dark-elevated p-6 text-center border-glow-cyan">
                            <div className="text-4xl mb-3">💧</div>
                            <p className="text-[var(--text-secondary)] text-sm mb-2">Humidity</p>
                            <p className="text-white text-2xl font-bold">
                                {weather.current.relative_humidity_2m}%
                            </p>
                        </div>
                        <div className="card-dark-elevated p-6 text-center border-glow-cyan">
                            <div className="text-4xl mb-3">🌡️</div>
                            <p className="text-[var(--text-secondary)] text-sm mb-2">Feels Like</p>
                            <p className="text-white text-2xl font-bold">
                                {Math.round(weather.current.temperature_2m)}°C
                            </p>
                        </div>
                    </div>

                    {/* Coordinates */}
                    <div className="card-dark-elevated p-4">
                        <div className="flex justify-between items-center text-[var(--text-secondary)] text-sm">
                            <div>
                                <span className="font-medium text-[var(--accent-cyan)]">Lat:</span> {weather.latitude.toFixed(4)}
                            </div>
                            <div>
                                <span className="font-medium text-[var(--accent-cyan)]">Lon:</span> {weather.longitude.toFixed(4)}
                            </div>
                        </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-center text-[var(--text-muted)] text-xs">
                        Last updated: {new Date(weather.current.time).toLocaleString()}
                    </div>
                </div>
            )}

            {/* Forecast Display */}
            {showForecast && forecast && <ForecastCard forecast={forecast} />}

            {/* Loading Forecast */}
            {showForecast && loadingForecast && (
                <div className="text-center text-[var(--text-secondary)] py-12">
                    <div className="w-12 h-12 border-4 border-[var(--bg-tertiary)] border-t-[var(--accent-cyan)] rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading forecast...</p>
                </div>
            )}

            {/* No Forecast Available */}
            {showForecast && !forecast && !loadingForecast && (
                <div className="text-center text-[var(--text-secondary)] py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <p>No forecast data available</p>
                </div>
            )}

            {/* AI Chat Assistant */}
            {showChat && <ChatBot city={city} includeForecast={true} />}

            {/* Initial State */}
            {!weather && !error && !loading && (
                <div className="text-center text-[var(--text-secondary)] py-12">
                    <div className="text-6xl mb-4">🌍</div>
                    <p className="text-lg">Search for a city or use your location</p>
                </div>
            )}
        </div>
    );
};
