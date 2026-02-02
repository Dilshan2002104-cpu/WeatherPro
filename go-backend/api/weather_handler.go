package api

import (
	"net/http"
	"weather-api/services"

	"github.com/gin-gonic/gin"
)

type WeatherHandler struct {
	services *services.AggregatorService
}

func NewWeatherHandler(services *services.AggregatorService) *WeatherHandler {
	return &WeatherHandler{services}
}

func (h *WeatherHandler) GetWeather(c *gin.Context) {
	city := c.Query("city")
	if city == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "city is required"})
		return
	}

	data, err := h.services.GetWeatherByCity(city)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (h *WeatherHandler) GetForecast(c *gin.Context) {
	city := c.Query("city")
	if city == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "city is required"})
		return
	}

	data, err := h.services.GetForecastByCity(city)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}
