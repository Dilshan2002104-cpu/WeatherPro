# Weather API

A RESTful weather API built with Go that provides current weather information for any city worldwide. The API uses Open-Meteo's free weather and geocoding services with built-in caching for improved performance.

## Features

- 🌍 Get weather data for any city worldwide
- 🚀 Fast response times with in-memory caching (10-minute TTL)
- 📊 Returns temperature, humidity, and weather conditions
- 🔄 Automatic geocoding (city name → coordinates)
- 🎯 Clean architecture with separation of concerns
- ⚡ Built with Gin web framework for high performance

## Tech Stack

- **Language**: Go 1.25.6
- **Web Framework**: [Gin](https://github.com/gin-gonic/gin)
- **External APIs**: 
  - [Open-Meteo Weather API](https://open-meteo.com/)
  - [Open-Meteo Geocoding API](https://geocoding-api.open-meteo.com/)

## Project Structure

```
weather-api/
├── api/                    # HTTP handlers
│   └── weather_handler.go  # Weather endpoint handler
├── cache/                  # Caching layer
│   └── memory_cache.go     # In-memory cache implementation
├── models/                 # Data models
│   ├── geocoding.go        # Geocoding response structure
│   └── weather.go          # Weather response structure
├── services/               # Business logic
│   ├── AggregatorService.go    # Orchestrates geocoding + weather
│   ├── geocoding_service.go    # City → coordinates conversion
│   └── weather_service.go      # Weather data fetching
├── main.go                 # Application entry point
├── go.mod                  # Go module dependencies
└── go.sum                  # Dependency checksums
```

## Architecture

The application follows a layered architecture:

1. **API Layer** (`api/`): Handles HTTP requests and responses
2. **Service Layer** (`services/`): Contains business logic
   - `AggregatorService`: Coordinates between geocoding and weather services
   - `GeocodingService`: Converts city names to coordinates
   - `WeatherService`: Fetches weather data from Open-Meteo
3. **Cache Layer** (`cache/`): Thread-safe in-memory caching with TTL
4. **Models** (`models/`): Data structures for API responses

## Getting Started

### Prerequisites

- Go 1.25.6 or higher
- Internet connection (for external API calls)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-api
```

2. Install dependencies:
```bash
go mod download
```

3. Build the application:
```bash
go build -o weather-api
```

### Running the Application

Start the server:
```bash
./weather-api
```

Or run directly without building:
```bash
go run main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

### Get Weather by City

**Endpoint**: `GET /api/weather`

**Query Parameters**:
- `city` (required): Name of the city

**Example Request**:
```bash
curl "http://localhost:8080/api/weather?city=London"
```

**Example Response**:
```json
{
  "latitude": 51.5074,
  "longitude": -0.1278,
  "current": {
    "time": "2026-02-02T12:00",
    "temperature_2m": 15.5,
    "relative_humidity_2m": 75,
    "weather_code": 3
  }
}
```

**Error Responses**:

- `400 Bad Request`: Missing city parameter
```json
{
  "error": "city is required"
}
```

- `500 Internal Server Error`: City not found or API error
```json
{
  "error": "city not found"
}
```

## Weather Codes

The API returns WMO weather codes. Common codes include:

- `0`: Clear sky
- `1, 2, 3`: Mainly clear, partly cloudy, and overcast
- `45, 48`: Fog
- `51, 53, 55`: Drizzle
- `61, 63, 65`: Rain
- `71, 73, 75`: Snow
- `95`: Thunderstorm

[Full WMO code list](https://open-meteo.com/en/docs)

## Caching

The application implements an in-memory cache with the following characteristics:

- **TTL**: 10 minutes
- **Key Format**: `weather:{city_name}`
- **Thread-Safe**: Uses `sync.RWMutex` for concurrent access
- **Automatic Expiration**: Expired entries are automatically ignored

## Development

### Running Tests

```bash
go test ./...
```

### Building for Production

```bash
go build -ldflags="-s -w" -o weather-api
```

## Configuration

Currently, the application uses hardcoded configuration:
- **Port**: 8080
- **Cache TTL**: 10 minutes

Future enhancements could include environment variable configuration.

## Dependencies

Main dependencies (see `go.mod` for complete list):
- `github.com/gin-gonic/gin` - HTTP web framework

## Future Enhancements

- [ ] Add environment variable configuration
- [ ] Implement request rate limiting
- [ ] Add support for forecast data (multi-day)
- [ ] Add unit tests
- [ ] Add Docker support
- [ ] Add API documentation with Swagger
- [ ] Implement Redis cache for distributed systems
- [ ] Add metrics and monitoring
- [ ] Support for multiple weather data providers

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]

## Author

[Add your information here]
