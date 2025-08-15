# 🗺️ Indiana Jones Journey Planner

A small React app to plan adventurous routes and visualize them on a Leaflet map with an "Indiana Jones"-style animated red trail.

## ✨ Features

- **Interactive form**: Add journey points by name and coordinates
- **Preset locations**: Quick-add buttons for popular destinations
- **Interactive map**: Leaflet map with custom markers
- **Animated trail**: Red line animates from point to point
- **Responsive UI**: Works on desktop and mobile
- **Adventure theme**: Stylized UI inspired by adventure films

## 🚀 Installation and usage

### Prerequisites
- Node.js (version 14 or later)
- npm or yarn

### Install
```bash
npm install
```

### TomTom API configuration
This app uses the TomTom API for place autocompletion. **If no TomTom API key is provided, autocomplete will be disabled** and users will need to enter coordinates manually.

1. **Get a free TomTom API key**:
   - Visit the TomTom Developer Portal: https://developer.tomtom.com/
   - Create a free account
   - Generate an API key

2. **Configure your key**:
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add:
VITE_TOMTOM_API_KEY=your_tomtom_key_here
```

3. **Restart the app**:
```bash
npm run dev
```

**With a TomTom key**: Autocomplete enabled
**Without a TomTom key**: Manual coordinate entry only or use

### Run in development
```bash
npm run dev
```

The app will be available at the address shown in the terminal (e.g. `http://localhost:5173`).

### Build for production
```bash
npm run build
```

## 🎮 How to use the app

1. **Add points**:
   - Use the form to enter name and latitude/longitude
   - Or use the Quick Add buttons to add preset locations

2. **View the route**:
   - Points appear on the map with colored markers
   - First point is the start (green), last is the destination (red)

3. **Start the animation**:
   - Click "🏃‍♂️ Start Journey" once you have at least 2 points
   - Watch the red line animate from point to point

4. **Reset**:
   - Click "🗑️ Reset" to clear all points and start over

## 🛠️ Technologies used

- **React**: UI
- **Vite**: Fast build tooling
- **Leaflet**: Interactive maps
- **React Leaflet**: React bindings for Leaflet
- **TomTom API**: Place autocompletion (required for autocomplete)
- **CSS Grid / Flexbox**: Layout and responsiveness

## 📂 Project structure

```
src/
├── components/
│   ├── LocationForm.jsx    # Form for adding points and autocomplete logic
│   └── MapComponent.jsx    # Map and animation logic
├── App.jsx                 # Main application component
├── App.css                 # Styles
└── main.jsx                # Entry point
```

## 🎨 Customization

### Adjust the animation
In `MapComponent.jsx` you can change:
- `steps`: number of interpolation steps between points
- animation delays in the `setTimeout` calls
- color and styling of the `Polyline`

### Add preset locations
Edit the `presetLocations` array in `LocationForm.jsx`.

### Customize icons
Change marker icon URLs in `MapComponent.jsx` or provide custom icons.

## 🐛 Troubleshooting

### Marker icons not showing
Leaflet marker icons are loaded from a CDN — check your network connection.

### Map bounds or centering issues
The app automatically computes bounds for all points. Verify coordinates are valid numbers.

## 🤝 Contributing

Contributions welcome: fork, create a branch, commit changes, push and open a PR.

## 📄 License

MIT
