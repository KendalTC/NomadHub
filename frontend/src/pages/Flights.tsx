// NomadHub - Flights Page
// Author: YOUR_NAME YOUR_LASTNAME

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchFlights } from '../api/index'
import type { FlightResults } from '../types/index'

function Flights() {
  const [searchParams] = useSearchParams()
  const [origin, setOrigin] = useState('SJO')
  const [destination, setDestination] = useState(searchParams.get('destination') || '')
  const [results, setResults] = useState<FlightResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!origin || !destination) return

    try {
      setLoading(true)
      setError(null)
      setResults(null)
      const data = await searchFlights(origin.toUpperCase(), destination.toUpperCase())
      setResults(data)
    } catch {
      setError('Error al buscar vuelos. Verificá los códigos de aeropuerto.')
    } finally {
      setLoading(false)
    }
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