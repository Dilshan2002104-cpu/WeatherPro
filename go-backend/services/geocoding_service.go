package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"weather-api/models"
)

type GeocodingService struct{}

func NewGeocodingService() *GeocodingService {
	return &GeocodingService{}
}

func (s *GeocodingService) GetCoordinates(city string) (float64, float64, error) {
	apiURL := fmt.Sprintf(
		"https://geocoding-api.open-meteo.com/v1/search?name=%s&count=1&language=en&format=json",
		url.QueryEscape(city),
	)

	resp, err := http.Get(apiURL)
	if err != nil {
		return 0, 0, err
	}
	defer resp.Body.Close()

	var data models.GeocodingResponse
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return 0, 0, err
	}

	if len(data.Results) == 0 {
		return 0, 0, fmt.Errorf("city not found")
	}

	return data.Results[0].Latitude, data.Results[0].Longitude, nil
}


