import { useState } from 'react'

const LocationForm = ({ onAddLocation }) => {
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.lat || !formData.lng) {
      alert('Please fill in all fields')
      return
    }

    const lat = parseFloat(formData.lat)
    const lng = parseFloat(formData.lng)

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Please enter valid coordinates')
      return
    }

    onAddLocation({
      name: formData.name,
      lat,
      lng
    })

    setFormData({ name: '', lat: '', lng: '' })
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Quelques locations prédéfinies pour faciliter les tests
  const presetLocations = [
    { name: 'Paris', lat: 48.8566, lng: 2.3522 },
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
    { name: 'Machu Picchu', lat: -13.1631, lng: -72.5450 }
  ]

  const addPresetLocation = (location) => {
    onAddLocation(location)
  }

  return (
    <div className="location-form">
      <h3>Add Journey Point</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Location Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Paris, Temple of Doom..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="lat">Latitude:</label>
            <input
              type="number"
              id="lat"
              name="lat"
              value={formData.lat}
              onChange={handleInputChange}
              placeholder="48.8566"
              step="any"
              min="-90"
              max="90"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lng">Longitude:</label>
            <input
              type="number"
              id="lng"
              name="lng"
              value={formData.lng}
              onChange={handleInputChange}
              placeholder="2.3522"
              step="any"
              min="-180"
              max="180"
            />
          </div>
        </div>

        <button type="submit" className="add-btn">
          📍 Add Location
        </button>
      </form>

      <div className="preset-locations">
        <h4>Quick Add:</h4>
        <div className="preset-buttons">
          {presetLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => addPresetLocation(location)}
              className="preset-btn"
              type="button"
            >
              {location.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LocationForm
