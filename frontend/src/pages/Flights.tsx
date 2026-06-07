// NomadHub - Flights Page
// Author: YOUR_NAME YOUR_LASTNAME

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchFlights, getAirportsByCountry } from '../api/index'
import type { FlightResults, Airport } from '../types/index'

function Flights() {
  const [searchParams] = useSearchParams()
  const countryCode = searchParams.get('country') || ''
  const countryName = searchParams.get('countryName') || ''

  const [origin, setOrigin] = useState('SJO')
  const [destination, setDestination] = useState('')
  const [results, setResults] = useState<FlightResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [airports, setAirports] = useState<Airport[]>([])
  const [loadingAirports, setLoadingAirports] = useState(false)
  const [showAirports, setShowAirports] = useState(false)

  const [countrySearch, setCountrySearch] = useState(countryName)
  const [countryResults, setCountryResults] = useState<any[]>([])
  const [showCountryResults, setShowCountryResults] = useState(false)
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCode)
  const [selectedCountryName, setSelectedCountryName] = useState(countryName)

  // Load airports when country is provided via URL
  const handleCountrySearch = async (value: string) => {
    setCountrySearch(value)
    if (value.length < 2) {
      setCountryResults([])
      setShowCountryResults(false)
      return
    }
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${value}?fields=name,cca2,translations,flags`)
      const data = await response.json()
      setCountryResults(data.slice(0, 6))
      setShowCountryResults(true)
    } catch {
      setCountryResults([])
    }
  }

  const handleCountrySelect = async (country: any) => {
    const name = country.translations?.spa?.common || country.name?.common
    const code = country.cca2
    setCountrySearch(name)
    setSelectedCountryName(name)
    setSelectedCountryCode(code)
    setShowCountryResults(false)
    setDestination('')
    setAirports([])
    try {
      setLoadingAirports(true)
      const data = await getAirportsByCountry(code)
      setAirports(data.airports || [])
      setShowAirports(true)
    } catch {
      setAirports([])
    } finally {
      setLoadingAirports(false)
    }
  }


  useEffect(() => {
    if (countryCode) {
      const fetchAirports = async () => {
        try {
          setLoadingAirports(true)
          const data = await getAirportsByCountry(countryCode)
          setAirports(data.airports || [])
          setShowAirports(true)
        } catch {
          setAirports([])
        } finally {
          setLoadingAirports(false)
        }
      }
      fetchAirports()
    }
  }, [countryCode])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!origin || !destination) return

    try {
      setLoading(true)
      setError(null)
      setResults(null)
      const data = await searchFlights(origin.toUpperCase(), destination.toUpperCase())
      setResults(data)
      setShowAirports(false)
    } catch {
      setError('Error al buscar vuelos. Verificá los códigos de aeropuerto.')
    } finally {
      setLoading(false)
    }
  }

  const handleAirportSelect = (iata: string) => {
    setDestination(iata)
    setShowAirports(false)
  }

  const formatTime = (isoString: string) => {
    if (!isoString || isoString === 'N/A') return 'N/A'
    try {
      return new Date(isoString).toLocaleTimeString('es-CR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--accent)'
      case 'landed': return 'var(--text-muted)'
      case 'scheduled': return 'var(--warning)'
      default: return 'var(--text-secondary)'
    }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
        Búsqueda de vuelos
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Ingresá los códigos IATA de los aeropuertos (ej: SJO, MIA, JFK)
      </p>

      {/* Country search */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 6px' }}>
          País destino
        </p>
        <input
          type="text"
          value={countrySearch}
          onChange={(e) => handleCountrySearch(e.target.value)}
          placeholder="Buscar país destino... ej: Japan"
          style={{
            width: '100%',
            background: 'var(--bg-secondary)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '10px 16px',
            fontSize: '14px',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        {showCountryResults && countryResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--bg-secondary)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            zIndex: 100,
            marginTop: '4px',
            overflow: 'hidden',
          }}>
            {countryResults.map((country) => {
              const name = country.translations?.spa?.common || country.name?.common
              return (
                <div
                  key={country.cca2}
                  onClick={() => handleCountrySelect(country)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderBottom: '0.5px solid var(--border)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <img
                    src={country.flags?.svg}
                    alt={name}
                    style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '2px' }}
                  />
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>{country.cca2}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Airport selector toggle */}
      {selectedCountryName && (
        <button
          type="button"
          onClick={() => setShowAirports(!showAirports)}
          style={{
            background: 'transparent',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '10px 16px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            width: '100%',
            textAlign: 'left',
          }}>
          {showAirports ? '▲ Ocultar' : '▼ Seleccionar'} aeropuerto en {selectedCountryName}
          {destination && <span style={{ color: 'var(--accent)', marginLeft: '8px' }}>· {destination} seleccionado</span>}
        </button>
      )}

      {/* Airport list */}
      {countryName && showAirports && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          marginBottom: '1.5rem',
        }}>
          {loadingAirports ? (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Cargando aeropuertos...</p>
          ) : airports.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              No se encontraron aeropuertos. Ingresá el código manualmente.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
              {airports.map((airport) => (
                <div
                  key={airport.iata}
                  onClick={() => handleAirportSelect(airport.iata)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '0.5px solid transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--bg-card)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'transparent'
                  }}
                >
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
                      {airport.name}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                      {airport.city}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    background: 'var(--bg-primary)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                  }}>
                    {airport.iata}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '2rem',
        flexWrap: 'wrap',
      }}>
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value.toUpperCase())}
          placeholder="Origen (ej: SJO)"
          maxLength={3}
          style={{
            flex: 1,
            minWidth: '120px',
            background: 'var(--bg-secondary)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '10px 16px',
            fontSize: '14px',
            color: 'var(--text-primary)',
            outline: 'none',
            textTransform: 'uppercase',
          }}
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value.toUpperCase())}
          placeholder="Destino (ej: MIA)"
          maxLength={3}
          style={{
            flex: 1,
            minWidth: '120px',
            background: 'var(--bg-secondary)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '10px 16px',
            fontSize: '14px',
            color: 'var(--text-primary)',
            outline: 'none',
            textTransform: 'uppercase',
          }}
        />
        <button type="submit" disabled={loading} style={{
          background: 'var(--accent)',
          border: 'none',
          borderRadius: 'var(--radius)',
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: 500,
          color: '#fff',
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? 'Buscando...' : '✈ Buscar'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div style={{
          background: '#2d1515',
          border: '0.5px solid var(--danger)',
          borderRadius: 'var(--radius)',
          padding: '12px 16px',
          marginBottom: '1.5rem',
          fontSize: '14px',
          color: 'var(--danger)',
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {results.count} vuelo{results.count !== 1 ? 's' : ''} encontrado{results.count !== 1 ? 's' : ''} · {results.origin} → {results.destination}
          </p>

          {results.flights.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              No se encontraron vuelos para esta ruta.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {results.flights.map((flight, index) => (
                <div key={index} style={{
                  background: 'var(--bg-secondary)',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                      {flight.airline}
                      {flight.flight_number && (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                          {flight.flight_number}
                        </span>
                      )}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                      {flight.departure_airport} → {flight.arrival_airport}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                      {formatTime(flight.departure_time)} → {formatTime(flight.arrival_time)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      padding: '3px 10px',
                      borderRadius: '10px',
                      background: 'var(--bg-card)',
                      color: getStatusColor(flight.status),
                      border: `0.5px solid ${getStatusColor(flight.status)}`,
                    }}>
                      {flight.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default Flights