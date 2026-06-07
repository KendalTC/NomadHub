// NomadHub - Home Page
// Author: YOUR_NAME YOUR_LASTNAME

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeaturedCountries } from '../api/index'
import type { Country } from '../types/index'
import MapView from '../components/MapView'

function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [featured, setFeatured] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)

  const handleCountryClick = (countryName: string) => {
    navigate(`/country/${countryName}`)
  }

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getFeaturedCountries()
        setFeatured(data)
      } catch {
        console.error('Error fetching featured countries')
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) navigate(`/country/${search.trim()}`)
  }

  return (
    <main style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <style>{`
        .hero-search input:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 3px rgba(29, 158, 117, 0.15);
        }
        .explore-btn {
          transition: all 0.2s ease;
        }
        .explore-btn:hover {
          background: var(--accent-hover) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(29, 158, 117, 0.35);
        }
        .country-card {
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .country-card:hover {
          transform: translateY(-6px);
          border-color: var(--accent) !important;
          box-shadow: 0 8px 32px rgba(29, 158, 117, 0.2);
        }
        .country-card:hover .card-flag {
          transform: scale(1.05);
        }
        .card-flag {
          transition: transform 0.25s ease;
        }
        .map-label {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 8px;
          padding-left: 2px;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .country-card {
          animation: fadeUp 0.5s ease forwards;
          opacity: 0;
        }
        .country-card:nth-child(1) { animation-delay: 0.05s; }
        .country-card:nth-child(2) { animation-delay: 0.1s; }
        .country-card:nth-child(3) { animation-delay: 0.15s; }
        .country-card:nth-child(4) { animation-delay: 0.2s; }
        .country-card:nth-child(5) { animation-delay: 0.25s; }
        .country-card:nth-child(6) { animation-delay: 0.3s; }
      `}</style>

      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: '4rem 2rem 2.5rem',
        background: 'linear-gradient(180deg, #0a1628 0%, var(--bg-primary) 100%)',
      }}>
        <div style={{
          display: 'inline-block',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--accent)',
          background: 'rgba(29, 158, 117, 0.1)',
          border: '0.5px solid rgba(29, 158, 117, 0.3)',
          borderRadius: '20px',
          padding: '4px 14px',
          marginBottom: '1.25rem',
          letterSpacing: '0.05em',
        }}>
          🌍 Explorá el mundo
        </div>

        <h1 style={{
          fontSize: '3rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 0.75rem',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}>
          ¿A dónde vas a viajar?
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          margin: '0 0 2.5rem',
          maxWidth: '480px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.6,
        }}>
          Explorá países, consultá el clima y encontrá vuelos en tiempo real.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="hero-search" style={{
          display: 'flex',
          gap: '10px',
          maxWidth: '520px',
          margin: '0 auto',
        }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar país... ej: Japan"
            style={{
              flex: 1,
              background: 'rgba(30, 41, 59, 0.8)',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '12px 18px',
              fontSize: '15px',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              backdropFilter: 'blur(8px)',
            }}
          />
          <button type="submit" className="explore-btn" style={{
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: 600,
            color: '#fff',
          }}>
            Explorar →
          </button>
        </form>
      </section>

      {/* Map */}
      <section style={{ padding: '0 2rem 2.5rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1000px' }}>
          <p className="map-label">Hacé clic en cualquier país para explorarlo</p>
          <MapView onCountryClick={handleCountryClick} />
        </div>
      </section>

      {/* Featured */}
      <section style={{
        padding: '2rem 2rem 4rem',
        background: 'linear-gradient(180deg, var(--bg-primary) 0%, #0a1628 100%)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <h2 style={{
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              margin: 0,
            }}>
              Destinos populares
            </h2>
            <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
          </div>

          {loading ? (
            <div style={{ display: 'flex', gap: '12px' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{
                  flex: 1,
                  height: '180px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '0.5px solid var(--border)',
                  opacity: 0.5,
                }} />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '14px',
            }}>
              {featured.map((country) => (
                <div
                  key={country.country_code}
                  className="country-card"
                  onClick={() => handleCountryClick(country.name_en)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '0.5px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ overflow: 'hidden', height: '90px' }}>
                    <img
                      src={country.flag_url}
                      alt={country.flag_alt}
                      className="card-flag"
                      style={{
                        width: '100%',
                        height: '90px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: '0 0 2px',
                    }}>
                      {country.name}
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      margin: '0 0 6px',
                    }}>
                      {country.region}
                    </p>
                    {country.weather && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(29, 158, 117, 0.08)',
                        border: '0.5px solid rgba(29, 158, 117, 0.2)',
                        borderRadius: '6px',
                        padding: '4px 8px',
                      }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>
                          {country.weather.temperature}°C
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                          {country.weather.description}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Home