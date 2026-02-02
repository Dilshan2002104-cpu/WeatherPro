package main

import (
	"time"
	"weather-api/api"
	"weather-api/cache"
	"weather-api/services"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	memCache := cache.NewMemoryCache(10 * time.Minute)

	geo := services.NewGeocodingService()
	weather := services.NewWeatherService()
	aggregator := services.NewAggregatorService(geo, weather, memCache)

	handler := api.NewWeatherHandler(aggregator)

	r.GET("/api/weather", handler.GetWeather)

	r.Run(":8080")
}
