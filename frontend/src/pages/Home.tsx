
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCountryProfile } from '../api/index'
import type { Country } from '../types/index'
/*import MapView from '../components/MapView'

*/
function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [featured, setFeatured] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)

  const featuredCountries = ['Japan', 'Italy', 'Mexico', 'France', 'Australia', 'Brazil']

  useEffect(() => {
    const fetchFeatured = async () => {
      const results: Country[] = []
      for (const name of featuredCountries) {
        try {
          const data = await getCountryProfile(name)
          results.push(data)
        } catch {
          // skip failed
        }
      }
      setFeatured(results)
      setLoading(false)
    }
    fetchFeatured()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/country/${search.trim()}`)
    }
  }

  const handleCountryClick = (countryName: string) => {
    navigate(`/country/${countryName}`)
  }

  return (
    <main style={{ minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 2rem 2rem',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}>
          ¿A dónde vas a viajar?
        </h1>
        <p style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
        }}>
          Explorá países, consultá el clima y encontrá vuelos en tiempo real.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} style={{
          display: 'flex',
          gap: '8px',
          maxWidth: '480px',
          margin: '0 auto',
        }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar país... ej: Japan"
            style={{
              flex: 1,
              background: 'var(--bg-secondary)',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '10px 16px',
              fontSize: '14px',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          <button type="submit" style={{
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#fff',
          }}>
            Explorar
          </button>
        </form>
      </section>

 {/* Map */}
{/*
<section style={{ padding: '0 2rem 2rem' }}>
  <MapView onCountryClick={handleCountryClick} />
</section>
*/}

      {/* Featured Countries */}
      <section style={{ padding: '0 2rem 3rem' }}>
        <h2 style={{
          fontSize: '13px',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
        }}>
          Destinos populares
        </h2>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Cargando destinos...</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '12px',
          }}>
            {featured.map((country) => (
              <div
                key={country.country_code}
                onClick={() => handleCountryClick(country.name)}
                style={{
                  background: 'var(--bg-card)',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <img
                  src={country.flag_url}
                  alt={country.flag_alt}
                  style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
                />
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                  {country.name}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  {country.region}
                </p>
                {country.weather && (
                  <p style={{ fontSize: '13px', color: 'var(--accent)', margin: '4px 0 0', fontWeight: 500 }}>
                    {country.weather.temperature}°C · {country.weather.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Home