// NomadHub - Navbar Component
// Author: YOUR_NAME YOUR_LASTNAME

import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav style={{
      background: '#0a0e1a',
      borderBottom: '0.5px solid var(--border)',
      padding: '0 2rem',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <Link to="/" style={{
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        🌍 NomadHub
      </Link>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link to="/" style={{
          fontSize: '14px',
          color: isActive('/') ? 'var(--accent)' : 'var(--text-secondary)',
          fontWeight: isActive('/') ? 500 : 400,
        }}>
          Inicio
        </Link>
        <Link to="/flights" style={{
          fontSize: '14px',
          color: isActive('/flights') ? 'var(--accent)' : 'var(--text-secondary)',
          fontWeight: isActive('/flights') ? 500 : 400,
        }}>
          Vuelos
        </Link>
        <Link to="/itineraries" style={{
          fontSize: '14px',
          color: isActive('/itineraries') ? 'var(--accent)' : 'var(--text-secondary)',
          fontWeight: isActive('/itineraries') ? 500 : 400,
        }}>
          Mis itinerarios
        </Link>
        <Link to="/itineraries/create" style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--bg-primary)',
          background: 'var(--accent)',
          padding: '6px 14px',
          borderRadius: 'var(--radius)',
        }}>
          + Nuevo
        </Link>
      </div>
    </nav>
  )
}

export default Navbar