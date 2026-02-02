package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"weather-api/models"
)

type WeatherService struct{}

func NewWeatherService() *WeatherService {
	return &WeatherService{}
}

func (s *WeatherService) GetWeather(lat, lon float64) (*models.WeatherResponse, error) {
	url := fmt.Sprintf(
		"https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto",
		lat, lon,
	)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var weather models.WeatherResponse
	if err := json.NewDecoder(resp.Body).Decode(&weather); err != nil {
		return nil, err
	}
	return &weather, nil
}

func (s *WeatherService) GetForecast(lat, lon float64) (*models.ForecastResponse, error) {
	url := fmt.Sprintf(
		"https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto&forecast_days=5",
		lat, lon,
	)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var forecast models.ForecastResponse
	if err := json.NewDecoder(resp.Body).Decode(&forecast); err != nil {
		return nil, err
	}
	return &forecast, nil
}
