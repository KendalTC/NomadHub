// NomadHub - Itinerary Form Page
// Author: YOUR_NAME YOUR_LASTNAME

import { useState, useEffect } from 'react'
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

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>
        {isEditing ? 'Editar itinerario' : 'Nuevo itinerario'}
      </h1>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
        <input name="destination_country" placeholder="País destino (ej: Japan)" value={form.destination_country} onChange={handleChange} required />
        <input name="destination_country_code" placeholder="Código país (ej: JP)" value={form.destination_country_code} onChange={handleChange} maxLength={3} />
        <input name="origin_city" placeholder="Ciudad origen" value={form.origin_city} onChange={handleChange} required />
        <label>Fecha de salida<input type="date" name="departure_date" value={form.departure_date} onChange={handleChange} required /></label>
        <label>Fecha de regreso<input type="date" name="return_date" value={form.return_date || ''} onChange={handleChange} /></label>
        <input type="number" name="budget" placeholder="Presupuesto (USD)" value={form.budget} onChange={handleChange} min={0} required />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="dreaming">Soñado</option>
          <option value="planned">Planificado</option>
          <option value="completed">Completado</option>
        </select>
        <textarea name="notes" placeholder="Notas..." value={form.notes} onChange={handleChange} rows={4} />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear itinerario'}
          </button>
          <button type="button" onClick={() => navigate('/itineraries')}>Cancelar</button>
        </div>
      </form>
    </main>
  )
}

export default ItineraryForm