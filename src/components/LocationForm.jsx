import { useState, useEffect, useRef } from 'react'

const LocationForm = ({ onAddLocation }) => {
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: ''
  })

  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef(null)
  const suggestionsRef = useRef(null)

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
    setShowSuggestions(false)
  }

  // Fonction pour rechercher des lieux via l'API TomTom uniquement
  const searchCities = async (query) => {
    const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY || null
    
    // Si pas de clé TomTom, ne pas faire de recherche
    if (!TOMTOM_API_KEY) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    
    try {
      const tomtomResponse = await searchWithTomTom(query, TOMTOM_API_KEY)
      if (tomtomResponse) {
        setSuggestions(tomtomResponse)
        setShowSuggestions(tomtomResponse.length > 0)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Erreur lors de la recherche TomTom:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Recherche avec l'API TomTom
  const searchWithTomTom = async (query, apiKey) => {
    try {
      const tomtomUrl = `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${apiKey}&typeahead=true&entityTypeSet=Municipality`

      const response = await fetch(tomtomUrl)
      
      if (!response.ok) {
        console.warn('TomTom API failed, falling back to Nominatim')
        return null
      }
      
      const data = await response.json()
      
      const places = data.results?.map(result => {
        const address = result.address || {}
        const position = result.position || {}
        
        return {
          name: address.municipality || address.freeformAddress || result.poi?.name || 'Unknown',
          fullAddress: address.freeformAddress || '',
          country: address.country || '',
          state: address.countrySubdivision || '',
          lat: position.lat || 0,
          lng: position.lon || 0,
          type: result.type === 'Geography' ? 'city' : result.entityType || 'place',
          importance: result.score || 0,
          source: 'tomtom'
        }
      }).filter(place => place.lat && place.lng) || []

      return places
    } catch (error) {
      console.warn('TomTom search failed:', error)
      return null
    }
  }

  // Gestion du changement dans le champ nom avec debounce
  const handleNameChange = (e) => {
    const value = e.target.value
    setFormData({
      ...formData,
      name: value
    })

    // Seulement si on a une clé TomTom
    const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY || null
    if (!TOMTOM_API_KEY) {
      return
    }

    // Débounce pour éviter trop de requêtes
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      searchCities(value)
    }, 300) // Attendre 300ms après la dernière frappe
  }

  // Sélectionner une suggestion
  const selectSuggestion = (city) => {
    setFormData({
      name: city.name,
      lat: city.lat.toString(),
      lng: city.lng.toString()
    })
    setShowSuggestions(false)
    setSuggestions([])
  }

  // Gérer les clics en dehors des suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

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

  // Vérifier quelle API est disponible
  const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY || null
  const autocompleteEnabled = !!TOMTOM_API_KEY

  return (
    <div className="location-form">
      <h3>Add Journey Point</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group autocomplete-container">
          <label htmlFor="name">Location Name:</label>
          <div className="input-container">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder={autocompleteEnabled ? "e.g., Paris, London, New York..." : "Enter location name manually"}
              autoComplete="off"
            />
            {isLoading && autocompleteEnabled && (
              <div className="loading-indicator">🔍</div>
            )}
            {showSuggestions && suggestions.length > 0 && autocompleteEnabled && (
              <div className="suggestions-list" ref={suggestionsRef}>
                {suggestions.map((city, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => selectSuggestion(city)}
                  >
                    <div className="suggestion-main">
                      <strong>{city.name}</strong>
                      <span className="suggestion-type">({city.type})</span>
                    </div>
                    {(city.state || city.country) && (
                      <div className="suggestion-location">
                        {city.state && `${city.state}, `}{city.country}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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
