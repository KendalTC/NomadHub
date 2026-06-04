
from django.db import models


class Itinerary(models.Model):

    STATUS_CHOICES = [
        ('dreaming', 'Soñado'),
        ('planned', 'Planificado'),
        ('completed', 'Completado'),
    ]

    title = models.CharField(max_length=200)
    destination_country = models.CharField(max_length=100)
    destination_country_code = models.CharField(max_length=3, blank=True)
    origin_city = models.CharField(max_length=100)
    departure_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='dreaming')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Itinerary'
        verbose_name_plural = 'Itineraries'

    def __str__(self):
        return f"{self.title} → {self.destination_country}"


class FlightSearch(models.Model):

    origin_iata = models.CharField(max_length=3)
    destination_iata = models.CharField(max_length=3)
    departure_date = models.DateField()
    lowest_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default='USD')
    results_count = models.IntegerField(default=0)
    searched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-searched_at']
        verbose_name = 'Flight Search'
        verbose_name_plural = 'Flight Searches'

    def __str__(self):
        return f"{self.origin_iata} → {self.destination_iata} | {self.departure_date}"