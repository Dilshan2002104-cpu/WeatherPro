package models

type ForecastResponse struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Daily     struct {
		Time             []string  `json:"time"`
		TemperatureMax   []float64 `json:"temperature_2m_max"`
		TemperatureMin   []float64 `json:"temperature_2m_min"`
		WeatherCode      []int     `json:"weather_code"`
		PrecipitationSum []float64 `json:"precipitation_sum"`
	} `json:"daily"`
}
