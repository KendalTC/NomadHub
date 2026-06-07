# NomadHub - API Views
# Author: YOUR_NAME YOUR_LASTNAME

import datetime
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Itinerary, FlightSearch
from .serializers import ItinerarySerializer, FlightSearchSerializer
from concurrent.futures import ThreadPoolExecutor, as_completed
from . import services


# ─── Country ──────────────────────────────────────────────────────────────────
@api_view(['GET'])
def country_profile(request, country_name):
    """Return full country profile with current weather."""
    country = services.get_country_profile(country_name)

    if not country:
        return Response({'error': f'Country "{country_name}" not found.'}, status=status.HTTP_404_NOT_FOUND)

    if 'error' in country:
        return Response({'error': country['error']}, status=status.HTTP_404_NOT_FOUND)

    weather = services.get_current_weather(country['lat'], country['lng'])
    country['weather'] = weather if 'error' not in weather else None

    return Response(country)



@api_view(['GET'])
def featured_countries(request):
    """Return multiple countries in parallel for faster loading."""
    names = ['Japan', 'Italy', 'Mexico', 'France', 'Australia', 'Brazil']

    def fetch_country(name):
        country = services.get_country_profile(name)
        if country and 'error' not in country:
            weather = services.get_current_weather(country['lat'], country['lng'])
            country['weather'] = weather if 'error' not in weather else None
            return country
        return None

    results = []
    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(fetch_country, name): name for name in names}
        for future in as_completed(futures):
            result = future.result()
            if result:
                results.append(result)

    return Response(results)

# ─── Weather ──────────────────────────────────────────────────────────────────

@api_view(['GET'])
def weather_for_date(request):
    """Return weather forecast or historical average for a given date and coordinates."""
    try:
        lat = float(request.GET.get('lat'))
        lng = float(request.GET.get('lng'))
        date_str = request.GET.get('date')
        target_date = datetime.date.fromisoformat(date_str)
    except (TypeError, ValueError):
        return Response({'error': 'Invalid parameters. Required: lat, lng, date (YYYY-MM-DD).'}, status=status.HTTP_400_BAD_REQUEST)

    result = services.get_weather_for_date(lat, lng, target_date)

    if 'error' in result:
        return Response({'error': result['error']}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(result)


# ─── Flights ──────────────────────────────────────────────────────────────────

@api_view(['GET'])
def flight_search(request):
    """Search flights between two airports."""
    origin = request.GET.get('origin', '').strip().upper()
    destination = request.GET.get('destination', '').strip().upper()

    if not origin or not destination:
        return Response({'error': 'Origin and destination are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if len(origin) != 3 or len(destination) != 3:
        return Response({'error': 'Airport codes must be 3 characters (e.g. SJO, MIA).'}, status=status.HTTP_400_BAD_REQUEST)

    results = services.search_flights(origin, destination)

    if 'error' in results:
        return Response({'error': results['error']}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Save search to database
    FlightSearch.objects.create(
        origin_iata=origin,
        destination_iata=destination,
        departure_date=datetime.date.today(),
        results_count=results['count'],
    )

    return Response(results)


# ─── Itineraries CRUD ─────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
def itinerary_list(request):
    """List all itineraries or create a new one."""
    if request.method == 'GET':
        status_filter = request.GET.get('status', '')
        itineraries = Itinerary.objects.all()
        if status_filter:
            itineraries = itineraries.filter(status=status_filter)
        serializer = ItinerarySerializer(itineraries, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ItinerarySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def itinerary_detail(request, pk):
    """Retrieve, update or delete an itinerary."""
    itinerary = get_object_or_404(Itinerary, pk=pk)

    if request.method == 'GET':
        serializer = ItinerarySerializer(itinerary)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ItinerarySerializer(itinerary, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        itinerary.delete()
        return Response({'message': 'Itinerary deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    
    
@api_view(['GET'])
def airports_by_country(request, country_code):
    """Return list of airports for a given country code."""
    result = services.get_airports_by_country(country_code)
    if 'error' in result:
        return Response({'error': result['error']}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(result)