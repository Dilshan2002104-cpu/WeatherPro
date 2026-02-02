export interface WeatherData {
    latitude: number;
    longitude: number;
    current: {
        time: string;
        temperature_2m: number;
        relative_humidity_2m: number;
        weather_code: number;
    };
}

export interface WeatherError {
    error: string;
}
