import { getWeatherInfo } from '../utils/weatherCodes';
import { WeatherCharts } from './WeatherCharts';
import type { ForecastData } from '../types/forecast';

interface ForecastCardProps {
    forecast: ForecastData;
}

export const ForecastCard = ({ forecast }: ForecastCardProps) => {
    // Transform data into daily items
    const dailyForecasts = forecast.daily.time.map((date, index) => ({
        date,
        max: forecast.daily.temperature_2m_max[index],
        min: forecast.daily.temperature_2m_min[index],
        code: forecast.daily.weather_code[index],
        precipitation: forecast.daily.precipitation_sum[index],
    }));

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Weather Charts */}
            <WeatherCharts forecast={forecast} />

            {/* Daily Forecast List */}
            <div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">
                    Daily Forecast
                </h3>
                <div className="space-y-3">
                    {dailyForecasts.map((day) => {
                        const weatherInfo = getWeatherInfo(day.code);
                        const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                        const fullDate = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                        return (
                            <div
                                key={day.date}
                                className="card-dark-elevated p-4 flex items-center justify-between border-glow-cyan"
                            >
                                {/* Day and Date */}
                                <div className="flex-1">
                                    <div className="text-white font-semibold">{dayName}</div>
                                    <div className="text-[var(--text-secondary)] text-sm">{fullDate}</div>
                                </div>

                                {/* Weather Icon */}
                                <div className="flex-1 text-center">
                                    <div className="text-4xl">{weatherInfo.emoji}</div>
                                    <div className="text-[var(--text-secondary)] text-xs mt-1">{weatherInfo.description}</div>
                                </div>

                                {/* Temperature */}
                                <div className="flex-1 text-right">
                                    <div className="text-white font-semibold">
                                        <span className="text-lg text-[var(--accent-cyan)]">{Math.round(day.max)}°</span>
                                        <span className="text-[var(--text-secondary)] text-sm ml-2">{Math.round(day.min)}°</span>
                                    </div>
                                    {day.precipitation > 0 && (
                                        <div className="text-[var(--accent-cyan)] text-xs mt-1">
                                            💧 {day.precipitation.toFixed(1)}mm
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
