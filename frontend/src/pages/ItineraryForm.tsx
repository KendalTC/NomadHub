// NomadHub - Itinerary Form Page
// Author: YOUR_NAME YOUR_LASTNAME

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getItinerary, createItinerary, updateItinerary } from '../api/index'
import type { Itinerary } from '../types/index'


function ItineraryForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEditing = !!id

  const [form, setForm] = useState<Itinerary>({
    title: '',
    destination_country: searchParams.get('country') || '',
    destination_country_code: searchParams.get('code') || '',
    origin_city: '',
    departure_date: '',
    return_date: null,
    budget: 0,
    status: 'dreaming',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEditing) {
      getItinerary(Number(id)).then(setForm).catch(() => setError('Error al cargar itinerario.'))
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      if (isEditing) {
        await updateItinerary(Number(id), form)
      } else {
        await createItinerary(form)
      }
      navigate('/itineraries')
    } catch {
      setError('Error al guardar. Verificá los campos.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-secondary)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '10px 14px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
  }

  const labelStyle = {
    fontSize: '11px',
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    color: 'var(--text-muted)',
    marginBottom: '6px',
    display: 'block',
  }

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCountryChange = async (value: string) => {
    setForm(prev => ({ ...prev, destination_country: value, destination_country_code: '' }))

    if (searchTimeout.current) clearTimeout(searchTimeout.current)

    if (value.length < 3) return

    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${value}?fields=name,cca2,translations`)
        const data = await response.json()
        if (data && data[0]) {
          const code = data[0].cca2
          const nameEs = data[0].translations?.spa?.common || data[0].name?.common
          setForm(prev => ({ ...prev, destination_country: nameEs, destination_country_code: code }))
        }
      } catch {
        // ignore
      }
    }, 800)
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>
        {isEditing ? 'Editar itinerario' : 'Nuevo itinerario'}
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 2rem' }}>
        {isEditing ? 'Modificá los datos de tu plan de viaje.' : 'Guardá tu próximo destino soñado.'}
      </p>

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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Title */}
        <div>
          <label style={labelStyle}>Título</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="ej: Viaje a Japón — primavera 2027"
            required
            style={inputStyle}
          />
        </div>

        {/* Country + Code */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px' }}>
          <div>
            <label style={labelStyle}>País destino</label>
            <input
              name="destination_country"
              value={form.destination_country}
              onChange={(e) => handleCountryChange(e.target.value)}
              placeholder="ej: Japan"
              required
              style={inputStyle}
            />
          </div>
          <div style={{ width: '80px' }}>
            <label style={labelStyle}>Código</label>
            <input
              name="destination_country_code"
              value={form.destination_country_code}
              onChange={handleChange}
              placeholder="JP"
              maxLength={3}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Origin city */}
        <div>
          <label style={labelStyle}>Ciudad origen</label>
          <input
            name="origin_city"
            value={form.origin_city}
            onChange={handleChange}
            placeholder="ej: San José"
            required
            style={inputStyle}
          />
        </div>

        {/* Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={labelStyle}>Fecha de salida</label>
            <input
              type="date"
              name="departure_date"
              value={form.departure_date}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Fecha de regreso</label>
            <input
              type="date"
              name="return_date"
              value={form.return_date || ''}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Budget + Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={labelStyle}>Presupuesto (USD)</label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              min={0}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Estado</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="dreaming">🌙 Soñado</option>
              <option value="planned">📋 Planificado</option>
              <option value="completed">✅ Completado</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={labelStyle}>Notas</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Recordatorios, ideas, cosas que querés hacer..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#fff',
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? 'Guardando...' : isEditing ? '✓ Actualizar itinerario' : '✓ Crear itinerario'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/itineraries')}
            style={{
              background: 'transparent',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '12px 20px',
              fontSize: '14px',
              color: 'var(--text-muted)',
            }}>
            Cancelar
          </button>
        </div>
      </form>
    </main>
  )

}

export default ItineraryForm