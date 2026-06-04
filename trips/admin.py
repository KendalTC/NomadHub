
from django.contrib import admin
from .models import Itinerary, FlightSearch


@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ['title', 'destination_country', 'origin_city', 'departure_date', 'budget', 'status']
    list_filter = ['status', 'destination_country']
    search_fields = ['title', 'destination_country', 'origin_city']
    ordering = ['-created_at']


@admin.register(FlightSearch)
class FlightSearchAdmin(admin.ModelAdmin):
    list_display = ['origin_iata', 'destination_iata', 'departure_date', 'lowest_price', 'currency', 'searched_at']
    ordering = ['-searched_at']