# 🗺️ Indiana Jones Journey Planner

Une application React interactive qui permet de planifier un voyage d'aventure et de visualiser l'itinéraire avec une animation style Indiana Jones !

## ✨ Fonctionnalités

- **Formulaire interactif** : Ajoutez facilement des points géographiques avec nom, latitude et longitude
- **Locations prédéfinies** : Boutons rapides pour ajouter des destinations célèbres
- **Carte interactive** : Visualisation sur une carte Leaflet avec markers personnalisés
- **Animation de trajet** : Ligne rouge animée qui dessine le parcours de point en point
- **Interface responsive** : Adaptée pour desktop et mobile
- **Style aventurier** : Thème visuel inspiré des films d'aventure

## 🚀 Installation et utilisation

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation
```bash
npm install
```

### Lancement en mode développement
```bash
npm run dev
```

L'application sera accessible à l'adresse `http://localhost:5173`

### Build pour la production
```bash
npm run build
```

## 🎮 Comment utiliser l'application

1. **Ajouter des points** :
   - Utilisez le formulaire pour saisir manuellement nom, latitude et longitude
   - Ou cliquez sur les boutons rapides pour ajouter des destinations célèbres

2. **Visualiser le trajet** :
   - Les points apparaissent sur la carte avec des markers colorés
   - Le premier point est vert (départ), le dernier est rouge (arrivée)

3. **Lancer l'animation** :
   - Cliquez sur "🏃‍♂️ Start Journey" quand vous avez au moins 2 points
   - Regardez la ligne rouge s'animer de point en point !

4. **Réinitialiser** :
   - Utilisez le bouton "🗑️ Reset" pour tout effacer et recommencer

## 🛠️ Technologies utilisées

- **React** : Interface utilisateur
- **Vite** : Outil de build rapide
- **Leaflet** : Cartes interactives
- **React Leaflet** : Intégration React pour Leaflet
- **CSS Grid/Flexbox** : Layout responsive

## 📂 Structure du projet

```
src/
├── components/
│   ├── LocationForm.jsx    # Formulaire d'ajout de points
│   └── MapComponent.jsx    # Composant carte avec animation
├── App.jsx                 # Composant principal
├── App.css                 # Styles principaux
└── main.jsx               # Point d'entrée
```

## 🎨 Personnalisation

### Modifier l'animation
Dans `MapComponent.jsx`, vous pouvez ajuster :
- `steps` : Nombre de points intermédiaires pour l'interpolation
- Délais d'animation dans les `setTimeout`
- Couleur et style de la ligne dans les props `Polyline`

### Ajouter des locations prédéfinies
Dans `LocationForm.jsx`, modifiez le tableau `presetLocations` :
```javascript
const presetLocations = [
  { name: 'Votre ville', lat: 48.8566, lng: 2.3522 },
  // ... autres locations
]
```

### Personnaliser les icônes
Dans `MapComponent.jsx`, modifiez les URLs des icônes Leaflet ou créez vos propres icônes personnalisées.

## 🐛 Dépannage

### Les icônes de markers ne s'affichent pas
Le projet inclut une configuration pour corriger les problèmes d'icônes Leaflet avec Vite. Si le problème persiste, vérifiez la connectivité internet (les icônes sont chargées depuis CDN).

### La carte ne se centre pas correctement
L'application calcule automatiquement les bounds pour inclure tous les points. Assurez-vous que les coordonnées sont valides.

## 🤝 Contribution

N'hésitez pas à contribuer au projet :
1. Forkez le repository
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

**Bon voyage et que l'aventure commence ! 🏺⚡**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
