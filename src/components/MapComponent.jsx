import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet icons when using Vite by setting default icon URLs
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

const MapComponent = ({ locations, isAnimating, onAnimationComplete }) => {
  const [animatedPath, setAnimatedPath] = useState([])
  const [center, setCenter] = useState([48.8566, 2.3522])
  const animationRef = useRef(null)
  const mapRef = useRef(null)

  // Custom icon for the starting point
  const startIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  // Custom icon for other points
  const endIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  // Function to interpolate points between two coordinates
  const interpolatePoints = (start, end, steps = 100) => {
    const points = []
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps
      const lat = start.lat + (end.lat - start.lat) * ratio
      const lng = start.lng + (end.lng - start.lng) * ratio
      points.push([lat, lng])
    }
    return points
  }

  // Animate the line segment by segment
  useEffect(() => {
    if (!isAnimating || locations.length < 2) return

    setAnimatedPath([])

    const animateSegment = (segmentIndex) => {
      if (segmentIndex >= locations.length - 1) {
        onAnimationComplete()
        return
      }

      const start = locations[segmentIndex]
      const end = locations[segmentIndex + 1]
      const segmentPoints = interpolatePoints(start, end)

      let pointIndex = -1
      const animatePoint = () => {
        pointIndex++
        if (segmentPoints[pointIndex]) {
          setAnimatedPath((prev) => [...prev, segmentPoints[pointIndex]])
          setCenter(segmentPoints[pointIndex])
          animationRef.current = setTimeout(animatePoint, 50)
        } else {
          setTimeout(() => animateSegment(segmentIndex + 1), 50)
        }
      }

      animatePoint()
    }

    animateSegment(0)

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
    }
  }, [isAnimating, locations, onAnimationComplete])

  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.setView(center, mapRef.current.getZoom())
    }
  }, [center])

  return (
    <div className="map-container">
      <MapContainer ref={mapRef} center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render markers */}
        {locations.map((location, index) => {
          let icon = null
          if (index === 0) icon = startIcon
          else if (index === locations.length - 1) icon = endIcon

          return (
            <Marker key={index} position={[location.lat, location.lng]} icon={icon}>
              <Popup>
                <div>
                  <strong>{location.name}</strong>
                  <br />
                  Point {index + 1}
                  <br />
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* Static polyline shown when not animating */}
        {!isAnimating && locations.length > 1 && animatedPath.length < 1 && (
          <Polyline positions={locations.map((loc) => [loc.lat, loc.lng])} color="gray" weight={2} opacity={0.5} dashArray="5, 10" />
        )}

        {/* Animated polyline */}
        {animatedPath.length > 1 && <Polyline positions={animatedPath} color="#dc2626" weight={4} opacity={0.8} />}
      </MapContainer>
    </div>
  )
}

export default MapComponent
