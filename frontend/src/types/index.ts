
export interface Weather {
  temperature: number;
  humidity: number;
  wind_speed: number;
  weather_code: number;
  description: string;
  uv_index: number;
}

export interface Country {
  name: string;
  name_en: string;  // agregar esta línea
  official_name: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  flag_url: string;
  flag_alt: string;
  languages: string[];
  currencies: string[];
  timezones: string[];
  borders: string[];
  lat: number;
  lng: number;
  country_code: string;
  google_maps: string;
  weather: Weather | null;
}

export interface Flight {
  airline: string;
  flight_number: string | null;
  departure_airport: string;
  departure_time: string;
  arrival_airport: string;
  arrival_time: string;
  status: string;
}

export interface FlightResults {
  flights: Flight[];
  count: number;
  origin: string;
  destination: string;
}

export interface Itinerary {
  id?: number;
  title: string;
  destination_country: string;
  destination_country_code: string;
  origin_city: string;
  departure_date: string;
  return_date: string | null;
  budget: number;
  status: 'dreaming' | 'planned' | 'completed';
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface WeatherForecast {
  type: 'forecast' | 'historical_average';
  date?: string;
  month?: string;
  temp_max: number;
  temp_min: number;
  precipitation?: number;
  precipitation_daily_avg?: number;
  description?: string;
  note?: string;
}

export interface Airport {
  iata: string;
  name: string;
  city: string;
}

