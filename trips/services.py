
import requests
from datetime import datetime, date, timedelta
from django.conf import settings


REGION_TRANSLATIONS = {
    'Africa': 'África',
    'Americas': 'América',
    'Asia': 'Asia',
    'Europe': 'Europa',
    'Oceania': 'Oceanía',
    'Antarctic': 'Antártica',
}

SUBREGION_TRANSLATIONS = {
    'Northern Africa': 'África del Norte',
    'Eastern Africa': 'África del Este',
    'Western Africa': 'África Occidental',
    'Southern Africa': 'África del Sur',
    'Middle Africa': 'África Central',
    'Northern America': 'América del Norte',
    'Central America': 'América Central',
    'South America': 'América del Sur',
    'Caribbean': 'Caribe',
    'Eastern Asia': 'Asia Oriental',
    'South-Eastern Asia': 'Asia Sudoriental',
    'Southern Asia': 'Asia Meridional',
    'Central Asia': 'Asia Central',
    'Western Asia': 'Asia Occidental',
    'Northern Europe': 'Europa del Norte',
    'Southern Europe': 'Europa del Sur',
    'Eastern Europe': 'Europa del Este',
    'Western Europe': 'Europa Occidental',
    'Australia and New Zealand': 'Australia y Nueva Zelanda',
    'Melanesia': 'Melanesia',
    'Micronesia': 'Micronesia',
    'Polynesia': 'Polinesia',
}

LANGUAGE_TRANSLATIONS = {
    'English': 'Inglés',
    'Spanish': 'Español',
    'French': 'Francés',
    'German': 'Alemán',
    'Portuguese': 'Portugués',
    'Italian': 'Italiano',
    'Japanese': 'Japonés',
    'Chinese': 'Chino',
    'Arabic': 'Árabe',
    'Russian': 'Ruso',
    'Korean': 'Coreano',
    'Dutch': 'Neerlandés',
    'Swedish': 'Sueco',
    'Norwegian': 'Noruego',
    'Danish': 'Danés',
    'Finnish': 'Finlandés',
    'Polish': 'Polaco',
    'Turkish': 'Turco',
    'Hindi': 'Hindi',
    'Bengali': 'Bengalí',
    'Malay': 'Malayo',
    'Indonesian': 'Indonesio',
    'Thai': 'Tailandés',
    'Vietnamese': 'Vietnamita',
    'Greek': 'Griego',
    'Czech': 'Checo',
    'Romanian': 'Rumano',
    'Hungarian': 'Húngaro',
    'Ukrainian': 'Ucraniano',
    'Swahili': 'Suajili',
    'Catalan': 'Catalán',
    'Croatian': 'Croata',
    'Slovak': 'Eslovaco',
    'Bulgarian': 'Búlgaro',
    'Serbian': 'Serbio',
    'Hebrew': 'Hebreo',
    'Urdu': 'Urdu',
    'Persian': 'Persa',
    'Tagalog': 'Tagalo',
}

# ─── REST Countries ───────────────────────────────────────────────────────────
def get_country_profile(country_name):
    """Fetch full country data from REST Countries API."""
    try:
        if len(country_name) == 2:
            url = f"https://restcountries.com/v3.1/alpha/{country_name}"
        else:
            url = f"https://restcountries.com/v3.1/name/{country_name}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

        if not data:
            return None

        country = data[0]

        # Extract currencies
        currencies = country.get('currencies', {})
        currency_info = []
        for code, info in currencies.items():
            currency_info.append(f"{info.get('name', '')} ({code})")

        # Extract languages
        languages = [LANGUAGE_TRANSLATIONS.get(lang, lang) for lang in country.get('languages', {}).values()]

        # Extract capital coordinates for weather
        latlng = country.get('capitalInfo', {}).get('latlng') or country.get('latlng', [0, 0])

        return {
    'name': country.get('translations', {}).get('spa', {}).get('common', '') or country.get('name', {}).get('common', ''),
    'name_en': country.get('name', {}).get('common', ''),
    'official_name': country.get('name', {}).get('official', ''),
    'capital': country.get('capital', ['N/A'])[0] if country.get('capital') else 'N/A',
    'region': REGION_TRANSLATIONS.get(country.get('region', ''), country.get('region', '')),
    'subregion': SUBREGION_TRANSLATIONS.get(country.get('subregion', ''), country.get('subregion', '')),
    'population': country.get('population', 0),
    'area': country.get('area', 0),
    'flag_url': country.get('flags', {}).get('svg', ''),
    'flag_alt': country.get('flags', {}).get('alt', ''),
    'languages': languages,
    'currencies': currency_info,
    'timezones': country.get('timezones', []),
    'borders': country.get('borders', []),
    'lat': latlng[0] if latlng else 0,
    'lng': latlng[1] if latlng else 0,
    'country_code': country.get('cca2', ''),
    'google_maps': country.get('maps', {}).get('googleMaps', ''),
}

    except requests.exceptions.ConnectionError:
        return {'error': 'Connection error. Please check your internet connection.'}
    except requests.exceptions.Timeout:
        return {'error': 'Request timed out. Please try again.'}
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return {'error': f'Country "{country_name}" not found.'}
        return {'error': f'API error: {e}'}
    except Exception as e:
        return {'error': f'Unexpected error: {e}'}


# ─── Open-Meteo ───────────────────────────────────────────────────────────────

WEATHER_CODES = {
    0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado',
    3: 'Nublado', 45: 'Neblina', 48: 'Neblina con escarcha',
    51: 'Llovizna ligera', 53: 'Llovizna moderada', 55: 'Llovizna intensa',
    61: 'Lluvia ligera', 63: 'Lluvia moderada', 65: 'Lluvia intensa',
    71: 'Nieve ligera', 73: 'Nieve moderada', 75: 'Nieve intensa',
    80: 'Chubascos ligeros', 81: 'Chubascos moderados', 82: 'Chubascos intensos',
    95: 'Tormenta eléctrica', 99: 'Tormenta con granizo',
}


def get_current_weather(lat, lng):
    """Fetch current weather for given coordinates."""
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            'latitude': lat,
            'longitude': lng,
            'current': 'temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode,uv_index',
            'timezone': 'auto',
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        current = data.get('current', {})

        weather_code = current.get('weathercode', 0)

        return {
            'temperature': round(current.get('temperature_2m', 0)),
            'humidity': current.get('relative_humidity_2m', 0),
            'wind_speed': round(current.get('wind_speed_10m', 0)),
            'weather_code': weather_code,
            'description': WEATHER_CODES.get(weather_code, 'Desconocido'),
            'uv_index': current.get('uv_index', 0),
        }

    except requests.exceptions.ConnectionError:
        return {'error': 'Could not connect to weather service.'}
    except requests.exceptions.Timeout:
        return {'error': 'Weather request timed out.'}
    except Exception as e:
        return {'error': f'Weather error: {e}'}


def get_weather_for_date(lat, lng, target_date):
    """
    Get weather based on date:
    - Within 16 days: real forecast
    - Beyond 16 days: historical average for that month
    """
    try:
        today = date.today()
        days_diff = (target_date - today).days

        if days_diff <= 16:
            # Real forecast
            url = "https://api.open-meteo.com/v1/forecast"
            params = {
                'latitude': lat,
                'longitude': lng,
                'daily': 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode',
                'start_date': target_date.isoformat(),
                'end_date': target_date.isoformat(),
                'timezone': 'auto',
            }
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            daily = data.get('daily', {})

            return {
                'type': 'forecast',
                'date': target_date.isoformat(),
                'temp_max': round(daily.get('temperature_2m_max', [0])[0]),
                'temp_min': round(daily.get('temperature_2m_min', [0])[0]),
                'precipitation': round(daily.get('precipitation_sum', [0])[0], 1),
                'description': WEATHER_CODES.get(daily.get('weathercode', [0])[0], 'Desconocido'),
            }

        else:
            # Historical average for that month (last 3 years)
            month = target_date.month
            results = []

            for year_offset in range(1, 4):
                past_year = target_date.year - year_offset
                start = date(past_year, month, 1)
                # Last day of month
                if month == 12:
                    end = date(past_year, 12, 31)
                else:
                    end = date(past_year, month + 1, 1) - timedelta(days=1)

                url = "https://archive-api.open-meteo.com/v1/archive"
                params = {
                    'latitude': lat,
                    'longitude': lng,
                    'daily': 'temperature_2m_max,temperature_2m_min,precipitation_sum',
                    'start_date': start.isoformat(),
                    'end_date': end.isoformat(),
                    'timezone': 'auto',
                }
                response = requests.get(url, params=params, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    daily = data.get('daily', {})
                    if daily.get('temperature_2m_max'):
                        avg_max = sum(daily['temperature_2m_max']) / len(daily['temperature_2m_max'])
                        avg_min = sum(daily['temperature_2m_min']) / len(daily['temperature_2m_min'])
                        avg_precip = sum(daily['precipitation_sum']) / len(daily['precipitation_sum'])
                        results.append({'max': avg_max, 'min': avg_min, 'precip': avg_precip})

            if results:
                final_max = round(sum(r['max'] for r in results) / len(results))
                final_min = round(sum(r['min'] for r in results) / len(results))
                final_precip = round(sum(r['precip'] for r in results) / len(results), 1)
                month_name = target_date.strftime('%B')

                return {
                    'type': 'historical_average',
                    'month': month_name,
                    'temp_max': final_max,
                    'temp_min': final_min,
                    'precipitation_daily_avg': final_precip,
                    'note': f'Promedio histórico para {month_name} (últimos 3 años)',
                }

            return {'error': 'Could not retrieve historical weather data.'}

    except Exception as e:
        return {'error': f'Weather forecast error: {e}'}


# ─── Aviation Stack ────────────────────────────────────────────────────────────

def search_flights(origin_iata, destination_iata):
    """Search flights between two airports using Aviation Stack."""
    try:
        url = "http://api.aviationstack.com/v1/flights"
        params = {
            'access_key': settings.AVIATION_KEY,
            'dep_iata': origin_iata.upper(),
            'arr_iata': destination_iata.upper(),
            'limit': 10,
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        if 'error' in data:
            return {'error': data['error'].get('message', 'Aviation API error.')}

        flights = []
        for flight in data.get('data', []):
            flights.append({
                'airline': flight.get('airline', {}).get('name', 'N/A'),
                'flight_number': flight.get('flight', {}).get('iata', 'N/A'),
                'departure_airport': flight.get('departure', {}).get('airport', 'N/A'),
                'departure_time': flight.get('departure', {}).get('scheduled', 'N/A'),
                'arrival_airport': flight.get('arrival', {}).get('airport', 'N/A'),
                'arrival_time': flight.get('arrival', {}).get('scheduled', 'N/A'),
                'status': flight.get('flight_status', 'N/A'),
            })

        return {
            'flights': flights,
            'count': len(flights),
            'origin': origin_iata.upper(),
            'destination': destination_iata.upper(),
        }

    except requests.exceptions.ConnectionError:
        return {'error': 'Could not connect to flight service.'}
    except requests.exceptions.Timeout:
        return {'error': 'Flight search timed out.'}
    except Exception as e:
        return {'error': f'Flight search error: {e}'}
    
def get_airports_by_country(country_code):
    """Fetch airports for a given country code using Aviation Stack."""
    try:
        url = "http://api.aviationstack.com/v1/airports"
        params = {
            'access_key': settings.AVIATION_KEY,
            'country_iso2': country_code.upper(),
            'limit': 20,
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        if 'error' in data:
            return {'error': data['error'].get('message', 'Aviation API error.')}

        airports = []
        for airport in data.get('data', []):
            iata = airport.get('iata_code')
            name = airport.get('airport_name')
            city = airport.get('city_iata_code') or airport.get('city', '')
            if iata:
                airports.append({
                    'iata': iata,
                    'name': name,
                    'city': city,
                })

        return {'airports': airports, 'count': len(airports)}

    except requests.exceptions.ConnectionError:
        return {'error': 'Could not connect to aviation service.'}
    except requests.exceptions.Timeout:
        return {'error': 'Request timed out.'}
    except Exception as e:
        return {'error': f'Airport search error: {e}'}