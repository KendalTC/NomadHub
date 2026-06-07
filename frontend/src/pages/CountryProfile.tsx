// NomadHub - Country Profile Page
// Author: YOUR_NAME YOUR_LASTNAME

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCountryProfile } from '../api/index'
import type { Country } from '../types/index'

function CountryProfile() {
  const { countryName } = useParams<{ countryName: string }>()
  const navigate = useNavigate()
  const [country, setCountry] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getCountryProfile(countryName!)
        setCountry(data)
      } catch {
        setError(`No se encontró información para "${countryName}".`)
      } finally {
        setLoading(false)
      }
    }
    fetchCountry()
  }, [countryName])

  if (loading) return (
    <main style={{ padding: '3rem 2rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Cargando información del país...</p>
    </main>
  )

  if (error) return (
    <main style={{ padding: '3rem 2rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>
      <button onClick={() => navigate('/')} style={{
        background: 'var(--accent)',
        border: 'none',
        borderRadius: 'var(--radius)',
        padding: '8px 16px',
        color: '#fff',
        fontSize: '14px',
      }}>
        Volver al inicio
      </button>
    </main>
  )

  if (!country) return null

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <img
          src={country.flag_url}
          alt={country.flag_alt}
          style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '0.5px solid var(--border)' }}
        />
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
            {country.name}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 10px' }}>
            {country.official_name}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {country.languages.map((lang) => (
              <span key={lang} style={{
                fontSize: '11px', fontWeight: 500,
                padding: '2px 8px', borderRadius: '10px',
                background: 'var(--bg-secondary)', color: 'var(--accent)',
                border: '0.5px solid var(--border)',
              }}>{lang}</span>
            ))}
            {country.currencies.map((cur) => (
              <span key={cur} style={{
                fontSize: '11px', fontWeight: 500,
                padding: '2px 8px', borderRadius: '10px',
                background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                border: '0.5px solid var(--border)',
              }}>{cur}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Weather */}
      {country.weather && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>
              Clima actual en {country.capital}
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--accent)', margin: '0 0 2px' }}>
              {country.weather.temperature}°C
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              {country.weather.description}
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '13px', color: 'var(--text-muted)' }}>
            <p style={{ margin: '0 0 4px' }}>Viento: {country.weather.wind_speed} km/h</p>
            <p style={{ margin: '0 0 4px' }}>Humedad: {country.weather.humidity}%</p>
            <p style={{ margin: 0 }}>UV: {country.weather.uv_index}</p>
          </div>
        </div>
      )}

      {/* Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '10px',
        marginBottom: '1.5rem',
      }}>
        <div style={{ background: 'var(--bg-secondary)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>Capital</p>
          <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{country.capital}</p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>Región</p>
          <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{country.region}</p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>Subregión</p>
          <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{country.subregion}</p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>Población</p>
          <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{country.population.toLocaleString()}</p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>Área</p>
          <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{country.area.toLocaleString()} km²</p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>Zona horaria</p>
          <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{country.timezones[0]}</p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate(`/flights?country=${country.country_code}&countryName=${country.name}`)}
          style={{
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#fff',
          }}>
          ✈ Buscar vuelos a {country.name}
        </button>
        <button
          onClick={() => navigate(`/itineraries/create?country=${country.name}&code=${country.country_code}`)}
          style={{
            background: 'transparent',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '10px 20px',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}>
          + Crear itinerario
        </button>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '10px 20px',
            fontSize: '14px',
            color: 'var(--text-muted)',
          }}>
          ← Volver
        </button>
      </div>
    </main>
  )
}

export default CountryProfile