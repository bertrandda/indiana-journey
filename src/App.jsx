import { useState, useCallback } from 'react'
import useSound from 'use-sound'
import LocationForm from './components/LocationForm'
import MapComponent from './components/MapComponent'
import './App.css'

function App() {
  const [locations, setLocations] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [play, { stop }] = useSound('../../indiana-journey/indiana-jones-theme-cut.ogg')

  const addLocation = (location) => {
    setLocations(prev => [...prev, location])
  }

  const removeLocation = (indexToRemove) => {
    setLocations(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const moveLocation = (fromIndex, toIndex) => {
    setLocations((prev) => {
      const newLocations = [...prev]
      const [movedLocation] = newLocations.splice(fromIndex, 1)
      newLocations.splice(toIndex, 0, movedLocation)
      return newLocations
    })
  }

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString())
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (dragIndex !== dropIndex) {
      moveLocation(dragIndex, dropIndex)
    }
  }

  const startJourney = () => {
    if (locations.length > 1) {
      setIsAnimating(true)
      setIsPanelOpen(false)
      play()
    }
  }

  const endJourney = useCallback(() => {
    setIsAnimating(false)
    stop()
  }, [stop])

  const resetJourney = useCallback(() => {
    setLocations([])
    endJourney()
  }, [endJourney])

  const togglePanel = () => {
    setIsPanelOpen(prev => !prev)
  }

  return (
    <div className="app">
      <div className="app-content">
        <button
          className="panel-toggle"
          onClick={togglePanel}
          title={isPanelOpen ? 'Close panel' : 'Open panel'}
        >
          {isPanelOpen ? '×' : '☰'}
        </button>

        <div className={`controls-panel ${isPanelOpen ? 'open' : ''}`}>
          <header className="app-header">
            <h1>🗺️ Your Indiana Jones journey</h1>
          </header>
          <LocationForm onAddLocation={addLocation} />

          <div className="action-buttons">
            <button
              onClick={isAnimating ? endJourney : startJourney}
              disabled={locations.length < 2}
              className="journey-btn"
            >
              {isAnimating ? 'Stop' : 'Start'}
            </button>
            <button
              onClick={resetJourney}
              className="reset-btn"
            >
              🗑️ Reset
            </button>
          </div>

          <div className="locations-list">
            <h3>
              Journey Points (
              {locations.length}
              )
            </h3>
            {locations.map((location, index) => (
              <div
                key={`${location.name}-${index}`}
                className="location-item"
                draggable
                onDragStart={e => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, index)}
              >
                <span className="drag-handle">⋮⋮</span>
                <span className="location-number">{index + 1}</span>
                <div className="location-details">
                  <strong>{location.name}</strong>
                  <br />
                  <small>
                    {location.lat.toFixed(4)}
                    ,
                    {' '}
                    {location.lng.toFixed(4)}
                  </small>
                </div>
                <button
                  onClick={() => removeLocation(index)}
                  className="delete-btn"
                  title="Remove location"
                  type="button"
                >
                  ✖️
                </button>
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
