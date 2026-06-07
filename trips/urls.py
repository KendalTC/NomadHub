
from django.urls import path
from . import views

app_name = 'trips'

urlpatterns = [
    # Country
    path('api/country/<str:country_name>/', views.country_profile, name='country_profile'),

    # Weather
    path('api/weather/', views.weather_for_date, name='weather_for_date'),

    # Flights
    path('api/flights/', views.flight_search, name='flight_search'),

    # Itineraries
    path('api/itineraries/', views.itinerary_list, name='itinerary_list'),
    path('api/itineraries/<int:pk>/', views.itinerary_detail, name='itinerary_detail'),
    
    path('api/featured/', views.featured_countries, name='featured_countries'),
    
    path('api/airports/<str:country_code>/', views.airports_by_country, name='airports_by_country'),
]