import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix pour les icônes Leaflet avec Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MapComponent = ({ locations, isAnimating, onAnimationComplete }) => {
  const [animatedPath, setAnimatedPath] = useState([])
  const [currentSegment, setCurrentSegment] = useState(0)
  const animationRef = useRef(null)

  // Créer une icône custom pour le point de départ
  const startIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  // Créer une icône custom pour le point d'arrivée
  const endIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  // Fonction pour interpoler entre deux points
  const interpolatePoints = (start, end, steps = 50) => {
    const points = []
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps
      const lat = start.lat + (end.lat - start.lat) * ratio
      const lng = start.lng + (end.lng - start.lng) * ratio
      points.push([lat, lng])
    }
    return points
  }

  // Animation de la ligne
  useEffect(() => {
    if (!isAnimating || locations.length < 2) {
      setAnimatedPath([])
      setCurrentSegment(0)
      return
    }

    setAnimatedPath([])
    setCurrentSegment(0)

    const animateSegment = (segmentIndex) => {
      if (segmentIndex >= locations.length - 1) {
        onAnimationComplete()
        return
      }

      const start = locations[segmentIndex]
      const end = locations[segmentIndex + 1]
      const segmentPoints = interpolatePoints(start, end, 30)

      let pointIndex = -1

      const animatePoint = () => {
        pointIndex++
        if (segmentPoints[pointIndex]) {
          setAnimatedPath(prev => [...prev, segmentPoints[pointIndex]])
          animationRef.current = setTimeout(animatePoint, 100) // 100ms entre chaque point
        } else {
          setCurrentSegment(segmentIndex + 1)
          setTimeout(() => animateSegment(segmentIndex + 1), 100) // Pause de 500ms entre les segments
        }
      }

      animatePoint()
    }

    animateSegment(0)

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [isAnimating, locations, onAnimationComplete])

  // Calculer les bounds pour centrer la carte
  const getBounds = () => {
    if (locations.length === 0) return null

    const lats = locations.map(loc => loc.lat)
    const lngs = locations.map(loc => loc.lng)

    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ]
  }

  const bounds = getBounds()
  const center = locations.length > 0
    ? [locations[0].lat, locations[0].lng]
    : [48.8566, 2.3522] // Paris par défaut

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={3}
        style={{ height: '100%', width: '100%' }}
        bounds={bounds}
        boundsOptions={{ padding: [20, 20] }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Afficher tous les markers */}
        {locations.map((location, index) => {
          let icon = null
          if (index === 0) icon = startIcon
          else if (index === locations.length - 1) icon = endIcon

          return (
            <Marker
              key={index}
              position={[location.lat, location.lng]}
              icon={icon}
            >
              <Popup>
                <div>
                  <strong>{location.name}</strong><br />
                  Point {index + 1}<br />
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* Ligne statique (affichée quand pas d'animation) */}
        {!isAnimating && locations.length > 1 && (
          <Polyline
            positions={locations.map(loc => [loc.lat, loc.lng])}
            color="gray"
            weight={2}
            opacity={0.5}
            dashArray="5, 10"
          />
        )}

        {/* Ligne animée */}
        {isAnimating && animatedPath.length > 1 && (
          <Polyline
            positions={animatedPath}
            color="#dc2626"
            weight={4}
            opacity={0.8}
          />
        )}
      </MapContainer>

      {isAnimating && (
        <div className="animation-overlay">
          <div className="animation-status">
            <div className="status-text">
              🏃‍♂️ Following the adventure trail...
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentSegment) / (locations.length - 1)) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapComponent
