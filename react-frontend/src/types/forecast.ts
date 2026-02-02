export interface DailyForecast {
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    weatherCode: number;
    precipitation: number;
}

export interface ForecastData {
    latitude: number;
    longitude: number;
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weather_code: number[];
        precipitation_sum: number[];
    };
}
