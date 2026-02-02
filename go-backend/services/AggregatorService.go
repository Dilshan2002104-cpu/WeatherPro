package services

import (
	"fmt"

	"weather-api/cache"
	"weather-api/models"
)

type AggregatorService struct {
	geo     *GeocodingService
	weather *WeatherService
	cache   *cache.MemoryCache
}

func NewAggregatorService(
	geo *GeocodingService,
	weather *WeatherService,
	cache *cache.MemoryCache,
) *AggregatorService {
	return &AggregatorService{geo, weather, cache}
}

func (s *AggregatorService) GetWeatherByCity(city string) (*models.WeatherResponse, error) {
	cacheKey := fmt.Sprintf("weather:%s", city)

	if cached, ok := s.cache.Get(cacheKey); ok {
		return cached.(*models.WeatherResponse), nil
	}

	lat, lon, err := s.geo.GetCoordinates(city)
	if err != nil {
		return nil, err
	}

	weather, err := s.weather.GetWeather(lat, lon)
	if err != nil {
		return nil, err
	}

	s.cache.Set(cacheKey, weather)
	return weather, nil
}

func (s *AggregatorService) GetForecastByCity(city string) (*models.ForecastResponse, error) {
	cacheKey := fmt.Sprintf("forecast:%s", city)

	if cached, ok := s.cache.Get(cacheKey); ok {
		return cached.(*models.ForecastResponse), nil
	}

	lat, lon, err := s.geo.GetCoordinates(city)
	if err != nil {
		return nil, err
	}

	forecast, err := s.weather.GetForecast(lat, lon)
	if err != nil {
		return nil, err
	}

	s.cache.Set(cacheKey, forecast)
	return forecast, nil
}
