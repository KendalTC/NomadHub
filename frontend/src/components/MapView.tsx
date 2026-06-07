// NomadHub - Interactive World Map Component
// Author: YOUR_NAME YOUR_LASTNAME

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'


const COUNTRY_NAME_MAP: Record<string, string> = {
    'Francia': 'France',
    'Alemania': 'Germany',
    'España': 'Spain',
    'Italia': 'Italy',
    'Países Bajos': 'Netherlands',
    'Bélgica': 'Belgium',
    'Suiza': 'Switzerland',
    'Austria': 'Austria',
    'Suecia': 'Sweden',
    'Noruega': 'Norway',
    'Dinamarca': 'Denmark',
    'Finlandia': 'Finland',
    'Polonia': 'Poland',
    'República Checa': 'Czech Republic',
    'Hungría': 'Hungary',
    'Rumania': 'Romania',
    'Bulgaria': 'Bulgaria',
    'Grecia': 'Greece',
    'Portugal': 'Portugal',
    'Croacia': 'Croatia',
    'Serbia': 'Serbia',
    'Ucrania': 'Ukraine',
    'Rusia': 'Russia',
    'Turquía': 'Turkey',
    'China': 'China',
    'Japón': 'Japan',
    'Corea del Sur': 'South Korea',
    'Corea del Norte': 'North Korea',
    'India': 'India',
    'Pakistán': 'Pakistan',
    'Irán': 'Iran',
    'Irak': 'Iraq',
    'Arabia Saudita': 'Saudi Arabia',
    'Emiratos Árabes Unidos': 'United Arab Emirates',
    'Israel': 'Israel',
    'Egipto': 'Egypt',
    'Sudáfrica': 'South Africa',
    'Nigeria': 'Nigeria',
    'Kenia': 'Kenya',
    'Etiopía': 'Ethiopia',
    'Tanzania': 'Tanzania',
    'Marruecos': 'Morocco',
    'Argelia': 'Algeria',
    'México': 'Mexico',
    'Colombia': 'Colombia',
    'Venezuela': 'Venezuela',
    'Perú': 'Peru',
    'Chile': 'Chile',
    'Ecuador': 'Ecuador',
    'Bolivia': 'Bolivia',
    'Paraguay': 'Paraguay',
    'Uruguay': 'Uruguay',
    'Brasil': 'Brazil',
    'Estados Unidos de América': 'United States',
    'Canadá': 'Canada',
    'Cuba': 'Cuba',
    'República Dominicana': 'Dominican Republic',
    'Guatemala': 'Guatemala',
    'Honduras': 'Honduras',
    'El Salvador': 'El Salvador',
    'Nicaragua': 'Nicaragua',
    'Costa Rica': 'Costa Rica',
    'Panamá': 'Panama',
    'Australia': 'Australia',
    'Nueva Zelanda': 'New Zealand',
    'Indonesia': 'Indonesia',
    'Malasia': 'Malaysia',
    'Filipinas': 'Philippines',
    'Tailandia': 'Thailand',
    'Vietnam': 'Vietnam',
    'Camboya': 'Cambodia',
    'Myanmar': 'Myanmar',
}

interface MapViewProps {
    onCountryClick: (countryName: string) => void
}

function MapView({ onCountryClick }: MapViewProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<L.Map | null>(null)
    const onCountryClickRef = useRef(onCountryClick)

    useEffect(() => {
        onCountryClickRef.current = onCountryClick
    }, [onCountryClick])

    useEffect(() => {
        if (!containerRef.current) return
        if (mapRef.current) return

        const container = containerRef.current as any
        if (container._leaflet_id) return

        const map = L.map(containerRef.current, {
            center: [20, 10],
            zoom: 2,
            minZoom: 2,
            maxZoom: 6,
            zoomControl: true,
            attributionControl: false,
            maxBounds: [[-90, -180], [90, 180]],
            maxBoundsViscosity: 1.0,
            worldCopyJump: false,
        })

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CARTO',
            subdomains: 'abcd',
            noWrap: true,
            bounds: [[-90, -180], [90, 180]],
        }).addTo(map)

        mapRef.current = map

        fetch('/countries.geojson')
            .then(res => res.json())
            .then(data => {
                if (!mapRef.current) return

                L.geoJSON(data, {
                    style: {
                        fillColor: '#1D9E75',
                        fillOpacity: 0.08,
                        color: '#334155',
                        weight: 0.8,
                    },
                    onEachFeature: (feature, layer) => {
                        const countryName = feature.properties?.ADMIN || feature.properties?.name

                        layer.on('mouseover', () => {
                            ; (layer as L.Path).setStyle({
                                fillOpacity: 0.35,
                                color: '#1D9E75',
                                weight: 1.5,
                            })
                        })

                        layer.on('mouseout', () => {
                            ; (layer as L.Path).setStyle({
                                fillOpacity: 0.08,
                                color: '#334155',
                                weight: 0.8,
                            })
                        })

                        layer.on('click', () => {
                            if (countryName) {
                                const englishName = COUNTRY_NAME_MAP[countryName] || countryName
                                onCountryClickRef.current(englishName)
                            }
                        })

                        layer.bindTooltip(countryName, {
                            permanent: false,
                            direction: 'center',
                            className: 'map-tooltip',
                        })
                    },
                }).addTo(map)
            })
            .catch(err => console.error('Error loading GeoJSON:', err))

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, [])

    return (
        <div style={{
            height: '350px',
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            background: '#0f1117',
        }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            <style>{`
        .map-tooltip {
          background: #1e293b;
          border: 0.5px solid #334155;
          border-radius: 4px;
          color: #e2e8f0;
          font-size: 12px;
          font-family: Inter, system-ui, sans-serif;
          padding: 4px 8px;
          box-shadow: none;
        }
        .leaflet-tooltip-top:before,
        .leaflet-tooltip-bottom:before,
        .leaflet-tooltip-left:before,
        .leaflet-tooltip-right:before {
          display: none;
        }
        .leaflet-control-zoom a {
          background: #1e293b !important;
          color: #e2e8f0 !important;
          border-color: #334155 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #334155 !important;
        }
      `}</style>
        </div>
    )
}

export default MapView