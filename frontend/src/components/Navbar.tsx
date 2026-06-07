// NomadHub - Navbar Component
// Author: YOUR_NAME YOUR_LASTNAME

import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <style>{`
        .nav-link {
          font-size: 14px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.2s ease;
          text-decoration: none;
          position: relative;
          display: inline-block;
        }
       .nav-link:hover {
          background: rgba(255,255,255,0.08);
          color: var(--text-primary) !important;
          transform: translateY(-1px);
        }
        .nav-link.active {
          color: var(--accent) !important;
          background: rgba(29, 158, 117, 0.1);
        }
        .nav-btn {
          font-size: 13px;
          font-weight: 600;
          color: #fff !important;
          background: var(--accent);
          padding: 7px 16px;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .nav-btn:hover {
          background: var(--accent-hover) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(29, 158, 117, 0.4);
          color: #fff !important;
        }
        .nav-logo {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: opacity 0.2s;
          letter-spacing: -0.02em;
        }
        .nav-logo:hover {
          opacity: 0.85;
          color: var(--text-primary) !important;
        }
        .nav-logo span {
          color: var(--accent);
        }
      `}</style>

      <nav style={{
        background: 'rgba(10, 14, 26, 0.85)',
        borderBottom: '0.5px solid rgba(51, 65, 85, 0.5)',
        padding: '0 2rem',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        {/* Logo */}
        <Link to="/" className="nav-logo">
          🌍 Nomad<span>Hub</span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            style={{ color: isActive('/') ? 'var(--accent)' : 'var(--text-secondary)' }}
          >
            Inicio
          </Link>
          <Link
            to="/flights"
            className={`nav-link ${isActive('/flights') ? 'active' : ''}`}
            style={{ color: isActive('/flights') ? 'var(--accent)' : 'var(--text-secondary)' }}
          >
            Vuelos
          </Link>
          <Link
            to="/itineraries"
            className={`nav-link ${isActive('/itineraries') ? 'active' : ''}`}
            style={{ color: isActive('/itineraries') ? 'var(--accent)' : 'var(--text-secondary)' }}
          >
            Mis itinerarios
          </Link>
          <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 8px' }} />
          <Link to="/itineraries/create" className="nav-btn">
            + Nuevo
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar