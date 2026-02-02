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

	// Add CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	memCache := cache.NewMemoryCache(10 * time.Minute)

	geo := services.NewGeocodingService()
	weather := services.NewWeatherService()
	aggregator := services.NewAggregatorService(geo, weather, memCache)

	handler := api.NewWeatherHandler(aggregator)

	r.GET("/api/weather", handler.GetWeather)
	r.GET("/api/forecast", handler.GetForecast)

	r.Run(":8080")
}
