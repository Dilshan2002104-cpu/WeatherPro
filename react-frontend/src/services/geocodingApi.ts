import type { GeocodingResponse } from '../types/geocoding';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const searchCities = async (query: string): Promise<GeocodingResponse> => {
    if (!query || query.length < 2) {
        return { results: [] };
    }

    // Filter to only Sri Lankan cities by adding country=LK parameter
    const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=10&language=en&format=json&country=LK`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch city suggestions');
        }
        return response.json();
    } catch (error) {
        console.error('Geocoding error:', error);
        return { results: [] };
    }
};
