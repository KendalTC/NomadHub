
from django import forms
from .models import Itinerary


class ItineraryForm(forms.ModelForm):

    class Meta:
        model = Itinerary
        fields = [
            'title',
            'destination_country',
            'destination_country_code',
            'origin_city',
            'departure_date',
            'return_date',
            'budget',
            'status',
            'notes',
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'placeholder': 'ej: Viaje a Japón — primavera 2027',
            }),
            'destination_country': forms.TextInput(attrs={
                'placeholder': 'ej: Japan',
            }),
            'destination_country_code': forms.TextInput(attrs={
                'placeholder': 'ej: JP',
                'maxlength': 3,
            }),
            'origin_city': forms.TextInput(attrs={
                'placeholder': 'ej: San José',
            }),
            'departure_date': forms.DateInput(attrs={
                'type': 'date',
            }),
            'return_date': forms.DateInput(attrs={
                'type': 'date',
            }),
            'budget': forms.NumberInput(attrs={
                'placeholder': 'ej: 3200',
                'min': 0,
            }),
            'notes': forms.Textarea(attrs={
                'placeholder': 'Notas, recordatorios, ideas...',
                'rows': 4,
            }),
        }

    def clean(self):
        cleaned_data = super().clean()
        departure = cleaned_data.get('departure_date')
        return_date = cleaned_data.get('return_date')

        if departure and return_date:
            if return_date < departure:
                raise forms.ValidationError(
                    'La fecha de regreso no puede ser anterior a la fecha de salida.'
                )

        return cleaned_data