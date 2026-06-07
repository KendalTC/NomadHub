// NomadHub - Itinerary Detail Page
// Author: YOUR_NAME YOUR_LASTNAME

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getItinerary, deleteItinerary } from '../api/index'
import { getCountryProfile, getWeatherForDate } from '../api/index'
import type { Itinerary, Country, WeatherForecast } from '../types/index'

function ItineraryDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [country, setCountry] = useState<Country | null>(null)
  const [forecast, setForecast] = useState<WeatherForecast | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const itin = await getItinerary(Number(id))
        setItinerary(itin)

        const countryData = await getCountryProfile(itin.destination_country_code || itin.destination_country)
        setCountry(countryData)

        const weatherData = await getWeatherForDate(
          countryData.lat,
          countryData.lng,
          itin.departure_date,
        )
        setForecast(weatherData)

      } catch {
        setError('No se pudo cargar el itinerario.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleDelete = async () => {
    if (!itinerary || !window.confirm(`¿Eliminar "${itinerary.title}"?`)) return
    try {
      await deleteItinerary(itinerary.id!)
      navigate('/itineraries')
    } catch {
      alert('Error al eliminar.')
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'dreaming': return 'Soñado'
      case 'planned': return 'Planificado'
      case 'completed': return 'Completado'
      default: return status
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'dreaming': return { background: '#26215C', color: '#CECBF6' }
      case 'planned': return { background: '#085041', color: '#9FE1CB' }
      case 'completed': return { background: '#412402', color: '#FAC775' }
      default: return {}
    }
  }

  if (loading) return (
    <main style={{ padding: '3rem 2rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Cargando itinerario...</p>
    </main>
  )

  if (error || !itinerary) return (
    <main style={{ padding: '3rem 2rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>
      <button onClick={() => navigate('/itineraries')} style={{
        background: 'var(--accent)', border: 'none',
        borderRadius: 'var(--radius)', padding: '8px 16px',
        color: '#fff', fontSize: '14px',
      }}>
        Volver a itinerarios
      </button>
    </main>
  )

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              {itinerary.title}
            </h1>
            <span style={{
              fontSize: '11px', fontWeight: 500,
              padding: '3px 10px', borderRadius: '10px',
              ...getStatusStyle(itinerary.status),
            }}>
              {getStatusLabel(itinerary.status)}
            </span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            {itinerary.origin_city} → {itinerary.destination_country}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate(`/itineraries/${id}/edit`)} style={{
            background: 'transparent',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '8px 16px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
          }}>
            ✏️ Editar
          </button>
          <button onClick={handleDelete} style={{
            background: 'transparent',
            border: '0.5px solid var(--danger)',
            borderRadius: 'var(--radius)',
            padding: '8px 16px',
            fontSize: '13px',
            color: 'var(--danger)',
          }}>
            🗑 Eliminar
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '10px',
        marginBottom: '1.5rem',
      }}>
        {[
          { label: 'Fecha de salida', value: itinerary.departure_date },
          { label: 'Fecha de regreso', value: itinerary.return_date || 'No definida' },
          { label: 'Presupuesto', value: `$${Number(itinerary.budget).toLocaleString()}` },
          { label: 'Estado', value: getStatusLabel(itinerary.status) },
        ].map((item) => (
          <div key={item.label} style={{
            background: 'var(--bg-secondary)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0.75rem 1rem',
          }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', margin: '0 0 4px' }}>
              {item.label}
            </p>
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Weather Forecast */}
      {forecast && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
        }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', margin: '0 0 10px' }}>
            {forecast.type === 'forecast' ? 'Pronóstico del clima' : 'Clima histórico promedio'}
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent)', margin: '0 0 2px' }}>
                {forecast.temp_min}° – {forecast.temp_max}°C
              </p>
              {forecast.description && (
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                  {forecast.description}
                </p>
              )}
            </div>
            {forecast.note && (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'flex-end', margin: 0 }}>
                {forecast.note}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Country Info */}
      {country && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}>
          <img
            src={country.flag_url}
            alt={country.flag_alt}
            style={{ width: '80px', height: '54px', objectFit: 'cover', borderRadius: '4px', border: '0.5px solid var(--border)' }}
          />
          <div>
            <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 4px' }}>
              {country.name}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 6px' }}>
              {country.capital} · {country.region} · {country.timezones[0]}
            </p>
            <button
              onClick={() => navigate(`/country/${country.name}`)}
              style={{
                fontSize: '12px', color: 'var(--accent)',
                background: 'transparent', border: 'none',
                padding: 0, cursor: 'pointer',
              }}>
              Ver perfil completo →
            </button>
          </div>
        </div>
      )}

      {/* Notes */}
      {itinerary.notes && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
        }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', margin: '0 0 8px' }}>
            Notas
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
            {itinerary.notes}
          </p>
        </div>
      )}

      {/* Back */}
      <button onClick={() => navigate('/itineraries')} style={{
        background: 'transparent',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '8px 16px',
        fontSize: '13px',
        color: 'var(--text-muted)',
      }}>
        ← Volver a itinerarios
      </button>
    </main>
  )
}

export default ItineraryDetail