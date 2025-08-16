import { useEffect, useRef, useState, memo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Marker, Polyline } from 'react-leaflet'
import { divIcon, LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MapComponent = memo(({ locations, isAnimating, onAnimationComplete }) => {
  const [animatedPath, setAnimatedPath] = useState([])
  const [center, setCenter] = useState([48.8566, 2.3522])
  const animationRef = useRef(null)
  const mapRef = useRef(null)

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

  const getZoomForDistance = (distance) => {
    if (distance < 50) return 9
    if (distance < 200) return 7
    if (distance < 1000) return 6

    return 4
  }

  // Animate the line segment by segment
  useEffect(() => {
    if (!isAnimating || locations.length < 2) return

    const animateSegment = (segmentIndex) => {
      if (segmentIndex >= locations.length - 1) {
        onAnimationComplete()
        return
      }

      const start = locations[segmentIndex]
      const end = locations[segmentIndex + 1]
      const segmentPoints = interpolatePoints(start, end)
      const distance = new LatLng(start.lat, start.lng).distanceTo(new LatLng(end.lat, end.lng)) / 1000
      mapRef.current.setView(start, getZoomForDistance(distance))

      let pointIndex = -1
      const animatePoint = () => {
        pointIndex++
        if (segmentPoints[pointIndex]) {
          setAnimatedPath(prev => [...prev, segmentPoints[pointIndex]])
          setCenter(segmentPoints[pointIndex])
          animationRef.current = setTimeout(animatePoint, 50)
        } else {
          setTimeout(() => animateSegment(segmentIndex + 1), 10)
        }
      }

      animatePoint()
    }

    setAnimatedPath([])
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

  useEffect(() => {
    if (locations.length === 0) {
      setAnimatedPath([])
    }
  }, [locations])

  return (
    <div className="map-container">
      <MapContainer ref={mapRef} center={center} zoom={4} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer
          attribution='Original map by <a href="https://stamen.com">Stamen Design</a>, under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.'
          url="https://watercolormaps.collection.cooperhewitt.org/tile/watercolor/{z}/{x}/{y}.jpg"
        />

        {/* Render red circle markers with city names */}
        {locations.map((location, index) => (
          <div key={index}>
            <CircleMarker
              center={[location.lat, location.lng]}
              radius={8}
              pathOptions={{
                fillColor: '#dc2626',
                color: '#dc2626',
                weight: 2,
                fillOpacity: 1,
              }}
            />
            <Marker
              position={[location.lat, location.lng]}
              icon={divIcon({
                html: `<div style="
                  color: #8B4513;
                  font-weight: bold;
                  font-size: 20px;
                  text-shadow: 2px 2px 4px rgba(255,255,255,0.8);
                  white-space: nowrap;
                  transform: translate(-50%, 15px);
                ">${location.name}</div>`,
                iconSize: [0, 0],
                iconAnchor: [0, 0],
                className: 'city-label',
              })}
            />
          </div>
        ))}

        {/* Static polyline shown when not animating */}
        {!isAnimating && locations.length > 1 && animatedPath.length < 1 && (
          <Polyline positions={locations.map(loc => [loc.lat, loc.lng])} color="gray" weight={2} opacity={0.5} dashArray="5, 10" />
        )}

        {/* Animated polyline */}
        {animatedPath.length > 1 && <Polyline positions={animatedPath} color="#dc2626" weight={6} />}
      </MapContainer>
    </div>
  )
})

export default MapComponent
