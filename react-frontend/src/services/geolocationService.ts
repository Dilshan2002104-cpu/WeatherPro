export interface GeolocationPosition {
    latitude: number;
    longitude: number;
}

export const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        reject(new Error('Please allow location access in your browser settings'));
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject(new Error('Location information unavailable. Please try again.'));
                        break;
                    case error.TIMEOUT:
                        reject(new Error('Location request timed out. Please try again or search manually.'));
                        break;
                    default:
                        reject(new Error('Unable to get location. Please search manually.'));
                }
            },
            {
                enableHighAccuracy: false, // Faster, works better on desktop
                timeout: 30000, // 30 seconds - more generous timeout
                maximumAge: 300000, // Accept cached position up to 5 minutes old
            }
        );
    });
};

// Reverse geocoding using Nominatim OpenStreetMap API
export const getCityFromCoordinates = async (
    lat: number,
    lon: number
): Promise<string> => {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'WeatherApp/1.0', 
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch location name');
        }

        const data = await response.json();

        // Try to get city, town, or village name
        const locationName =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            'Your Location';

        return locationName;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return 'Your Location';
    }
};
