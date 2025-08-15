import { useState } from 'react'
import useSound from 'use-sound';
import LocationForm from './components/LocationForm'
import MapComponent from './components/MapComponent'
import './App.css'

function App() {
  const [locations, setLocations] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [play, { stop }] = useSound('../../indiana-jones-theme.ogg');

  const addLocation = (location) => {
    setLocations(prev => [...prev, location])
  }

  const startJourney = () => {
    if (locations.length > 1) {
      setIsAnimating(true)
      play()
    }
  }

  const endJourney = () => {
    setIsAnimating(false)
    stop()
  }

  const resetJourney = () => {
    setLocations([])
    setIsAnimating(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🗺️ Indiana Jones Journey Planner</h1>
        <p>Plan your adventure and watch the journey unfold!</p>
      </header>

      <div className="app-content">
        <div className="controls-panel">
          <LocationForm onAddLocation={addLocation} />

          <div className="action-buttons">
            <button
              onClick={startJourney}
              disabled={locations.length < 2 || isAnimating}
              className="journey-btn"
            >
              🏃‍♂️ Start Journey
            </button>
            <button
              onClick={resetJourney}
              className="reset-btn"
            >
              🗑️ Reset
            </button>
          </div>

          <div className="locations-list">
            <h3>Journey Points ({locations.length})</h3>
            {locations.map((location, index) => (
              <div key={index} className="location-item">
                <span className="location-number">{index + 1}</span>
                <div className="location-details">
                  <strong>{location.name}</strong>
                  <br />
                  <small>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="map-panel">
          <MapComponent
            locations={locations}
            isAnimating={isAnimating}
            onAnimationComplete={endJourney}
          />
        </div>
      </div>
    </div>
  )
}

export default App
