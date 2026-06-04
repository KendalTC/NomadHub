// NomadHub - Itinerary List Page
// Author: YOUR_NAME YOUR_LASTNAME

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getItineraries, deleteItinerary } from '../api/index'
import type { Itinerary } from '../types/index'

function ItineraryList() {
  const navigate = useNavigate()
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchItineraries = async () => {
    try {
      setLoading(true)
      const data = await getItineraries(statusFilter)
      setItineraries(data)
    } catch {
      console.error('Error fetching itineraries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItineraries()
  }, [statusFilter])

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`¿Estás seguro que querés eliminar "${title}"?`)) return
    try {
      setDeleting(id)
      await deleteItinerary(id)
      setItineraries(prev => prev.filter(i => i.id !== id))
    } catch {
      alert('Error al eliminar el itinerario.')
    } finally {
      setDeleting(null)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'dreaming': return { background: '#26215C', color: '#CECBF6' }
      case 'planned': return { background: '#085041', color: '#9FE1CB' }
      case 'completed': return { background: '#412402', color: '#FAC775' }
      default: return { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }
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

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
            Mis itinerarios
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            {itineraries.length} plan{itineraries.length !== 1 ? 'es' : ''} guardado{itineraries.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => navigate('/itineraries/create')}
          style={{
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#fff',
          }}>
          + Nuevo itinerario
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        {[
          { value: '', label: 'Todos' },
          { value: 'dreaming', label: 'Soñados' },
          { value: 'planned', label: 'Planificados' },
          { value: 'completed', label: 'Completados' },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              padding: '5px 14px',
              borderRadius: '20px',
              border: '0.5px solid var(--border)',
              background: statusFilter === opt.value ? 'var(--text-primary)' : 'transparent',
              color: statusFilter === opt.value ? 'var(--bg-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Cargando itinerarios...</p>
      ) : itineraries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '1rem' }}>
            No hay itinerarios guardados aún.
          </p>
          <button
            onClick={() => navigate('/itineraries/create')}
            style={{
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '10px 20px',
              fontSize: '14px',
              color: '#fff',
            }}>
            Crear mi primer itinerario
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {itineraries.map((itinerary) => (
            <div key={itinerary.id} style={{
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
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                  {itinerary.title}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                  {itinerary.origin_city} → {itinerary.destination_country} · {itinerary.departure_date}
                  {itinerary.return_date && ` – ${itinerary.return_date}`} · ${Number(itinerary.budget).toLocaleString()}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: '10px',
                  ...getStatusStyle(itinerary.status),
                }}>
                  {getStatusLabel(itinerary.status)}
                </span>

                <button
                  onClick={() => navigate(`/itineraries/${itinerary.id}`)}
                  style={{
                    width: '32px', height: '32px',
                    borderRadius: 'var(--radius)',
                    background: 'var(--bg-card)',
                    border: '0.5px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                  👁
                </button>
                <button
                  onClick={() => navigate(`/itineraries/${itinerary.id}/edit`)}
                  style={{
                    width: '32px', height: '32px',
                    borderRadius: 'var(--radius)',
                    background: 'var(--bg-card)',
                    border: '0.5px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(itinerary.id!, itinerary.title)}
                  disabled={deleting === itinerary.id}
                  style={{
                    width: '32px', height: '32px',
                    borderRadius: 'var(--radius)',
                    background: 'var(--bg-card)',
                    border: '0.5px solid var(--border)',
                    color: 'var(--danger)',
                    fontSize: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: deleting === itinerary.id ? 0.5 : 1,
                  }}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default ItineraryList