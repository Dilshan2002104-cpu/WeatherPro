package models

type WeatherResponse struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Current   struct {
		Time        string  `json:"time"`
		Temperature float64 `json:"temperature_2m"`
		Humidity    int     `json:"relative_humidity_2m"`
		WeatherCode int     `json:"weather_code"`
	} `json:"current"`
}
