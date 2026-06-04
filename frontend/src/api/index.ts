
import axios from 'axios';
import type { Country, FlightResults, Itinerary, WeatherForecast } from '../types/index';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});


// ─── Country ──────────────────────────────────────────────────────────────────

export const getCountryProfile = async (countryName: string): Promise<Country> => {
  const response = await API.get(`/api/country/${countryName}/`);
  return response.data;
};


// ─── Weather ──────────────────────────────────────────────────────────────────

export const getWeatherForDate = async (
  lat: number,
  lng: number,
  date: string
): Promise<WeatherForecast> => {
  const response = await API.get('/api/weather/', {
    params: { lat, lng, date },
  });
  return response.data;
};


// ─── Flights ──────────────────────────────────────────────────────────────────

export const searchFlights = async (
  origin: string,
  destination: string
): Promise<FlightResults> => {
  const response = await API.get('/api/flights/', {
    params: { origin, destination },
  });
  return response.data;
};


// ─── Itineraries ──────────────────────────────────────────────────────────────

export const getItineraries = async (statusFilter?: string): Promise<Itinerary[]> => {
  const params = statusFilter ? { status: statusFilter } : {};
  const response = await API.get('/api/itineraries/', { params });
  return response.data;
};

export const getItinerary = async (id: number): Promise<Itinerary> => {
  const response = await API.get(`/api/itineraries/${id}/`);
  return response.data;
};

export const createItinerary = async (data: Itinerary): Promise<Itinerary> => {
  const response = await API.post('/api/itineraries/', data);
  return response.data;
};

export const updateItinerary = async (id: number, data: Itinerary): Promise<Itinerary> => {
  const response = await API.put(`/api/itineraries/${id}/`, data);
  return response.data;
};

export const deleteItinerary = async (id: number): Promise<void> => {
  await API.delete(`/api/itineraries/${id}/`);
};