

from rest_framework import serializers
from .models import Itinerary, FlightSearch


class ItinerarySerializer(serializers.ModelSerializer):

    class Meta:
        model = Itinerary
        fields = '__all__'

    def validate(self, data):
        departure = data.get('departure_date')
        return_date = data.get('return_date')

        if departure and return_date:
            if return_date < departure:
                raise serializers.ValidationError(
                    'Return date cannot be earlier than departure date.'
                )
        return data


class FlightSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlightSearch
        fields = '__all__'