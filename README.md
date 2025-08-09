# 🧠 Geodesic Emotion Dome

<div align="center">

![Geodesic Emotion Dome](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Three.js](https://img.shields.io/badge/Three.js-r128-black.svg)
![GSAP](https://img.shields.io/badge/GSAP-3.12.4-88ce02.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**An interactive 3D visualization exploring the architecture of human emotions through geodesic geometry**

[View Demo](https://dnoice.github.io/geodesic-emotion-dome) · [Report Bug](https://github.com/dnoice/geodesic-emotion-dome/issues) · [Request Feature](https://github.com/dnoice/geodesic-emotion-dome/issues)

<img src="assets/preview.gif" alt="Emotion Dome Preview" width="800px">

</div>

---

## ✨ Features

### 🎯 Core Functionality
- **3D Geodesic Visualization** - 22 emotion nodes positioned on an interactive geodesic sphere
- **Dynamic Connections** - Visualize relationships between different emotional states
- **Category Filtering** - Explore emotions by category (Joy, Love, Sadness, Anger, Fear, Calm)
- **Real-time Search** - Find specific emotions using intelligent keyword search
- **Emotional Journey Tracking** - Track your exploration path through the emotional landscape

### 🎨 Visual Experience
- **Post-processing Effects** - Bloom, glow, and particle effects for immersive visualization
- **Glassmorphism UI** - Modern, translucent interface panels
- **Smooth Animations** - GSAP-powered transitions and interactions
- **Dynamic Lighting** - Moving light sources and atmospheric effects
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### ⚡ Interactions
- **Click & Drag** - Rotate the dome to explore from any angle
- **Scroll to Zoom** - Get closer or further from the emotional architecture
- **Node Selection** - Click emotions to focus and reveal connections
- **Keyboard Shortcuts** - Power user controls for efficient navigation
- **Touch Support** - Full mobile touch interaction support

### 🔊 Audio & Accessibility
- **Ambient Soundscape** - Optional atmospheric audio using Howler.js
- **Sound Effects** - Interaction feedback sounds
- **Screen Reader Support** - ARIA labels and semantic HTML
- **Keyboard Navigation** - Complete keyboard accessibility

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server for development (e.g., Live Server, http-server)
- Node.js 16+ (optional, for build tools)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/dnoice/geodesic-emotion-dome.git
cd geodesic-emotion-dome
```

2. **Install dependencies** (optional, for development)
```bash
npm install
```

3. **Start local server**

Using Python:
```bash
python -m http.server 8000
```

Using Node.js:
```bash
npx http-server -p 8000
```

Using VS Code Live Server:
- Right-click `index.html`
- Select "Open with Live Server"

4. **Open in browser**
```
http://localhost:8000
```

## 📁 Project Structure

```
geodesic-emotion-dome/
│
├── index.html              # Main HTML entry point
├── css/
│   └── styles.css         # Enhanced stylesheet with design system
├── js/
│   └── script.js          # Core application logic
├── assets/
│   ├── sounds/            # Audio files (if any)
│   ├── images/            # Images and icons
│   └── preview.gif        # Demo preview
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md    # Technical architecture
│   └── API.md            # API documentation
├── LICENSE               # MIT license
├── README.md            # This file
├── package.json         # NPM configuration
└── .gitignore          # Git ignore rules
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Toggle auto-rotation |
| `F` | Enter fullscreen |
| `S` | Toggle sound |
| `R` | Reset view |
| `/` | Focus search |
| `H` | Show help |
| `Esc` | Deselect node |
| `1-7` | Quick category filters |
| `←/→` | Navigate categories |
| `Ctrl+Z` | Undo last action |

## 🛠️ Configuration

### Settings Object
```javascript
const settings = {
    animationSpeed: 0.5,      // 0-1 animation speed multiplier
    connectionOpacity: 0.3,    // 0-1 connection line opacity
    nodeSize: 1,              // 0.5-1.5 node scale multiplier
    showLabels: true,         // Show/hide emotion labels
    autoRotate: true,         // Auto-rotate dome
    particleEffects: true,    // Enable particle system
    soundEnabled: true,       // Enable sound effects
    showPerformance: false    // Show FPS counter
};
```

### Emotion Data Structure
```javascript
{
    id: 'joy',
    name: 'Joy',
    category: 'joy',
    color: '#FFD700',
    desc: 'Pure happiness and delight',
    connections: ['excitement', 'gratitude', 'love', 'hope'],
    strength: 85,
    valence: 0.9,        // -1 to 1 (negative to positive)
    arousal: 0.7,        // -1 to 1 (calm to excited)
    keywords: ['happy', 'cheerful', 'delighted'],
    quote: 'Joy is the simplest form of gratitude'
}
```

## 🎨 Customization

### Adding New Emotions
1. Add emotion data to `emotionsData` array in `js/script.js`
2. Define connections to existing emotions
3. Assign appropriate category and color
4. Add keywords for search functionality

### Modifying Visual Theme
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary-hue: 250;
    --primary: hsl(var(--primary-hue), 70%, 60%);
    --bg-dark: #0a0e27;
    --accent: #00ffcc;
    /* ... more variables */
}
```

### Custom Categories
1. Add category to HTML template
2. Define category color in CSS
3. Update filtering logic in JavaScript
4. Add category icon from Font Awesome

## 📊 Performance

- **Optimized Rendering** - Uses Three.js EffectComposer for efficient post-processing
- **Debounced Search** - Prevents excessive re-rendering during typing
- **LOD System** - Level of detail adjustments based on zoom level
- **RequestAnimationFrame** - Smooth 60fps animations
- **GPU Acceleration** - Hardware-accelerated 3D rendering

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** - 3D graphics library
- **GSAP** - Animation platform
- **Font Awesome** - Icon library
- **Howler.js** - Audio library
- **Tippy.js** - Tooltip library
- **Google Fonts** - Typography

## 🌟 Inspiration

This project explores the interconnected nature of human emotions, inspired by:
- Plutchik's Wheel of Emotions
- Geodesic dome architecture by Buckminster Fuller
- Network visualization theory
- Emotional intelligence research

## 📈 Roadmap

- [ ] VR/AR support for immersive exploration
- [ ] Emotion intensity heat mapping
- [ ] User emotion tracking over time
- [ ] Social sharing of emotional states
- [ ] Machine learning emotion predictions
- [ ] Multi-language support
- [ ] Emotion journal integration
- [ ] Collaborative emotion mapping

## 💬 Support

For support, email support@emotiondome.com or open an issue in the [GitHub repository](https://github.com/dnoice/geodesic-emotion-dome/issues).

## 📸 Screenshots

<div align="center">
<img src="assets/screenshots/main-view.png" alt="Main View" width="400px">
<img src="assets/screenshots/filtered-view.png" alt="Filtered View" width="400px">
<img src="assets/screenshots/node-detail.png" alt="Node Detail" width="400px">
<img src="assets/screenshots/settings.png" alt="Settings Panel" width="400px">
</div>

---

<div align="center">

Made with ❤️ and Three.js

[Website](https://emotiondome.com) · [Twitter](https://twitter.com/emotiondome) · [LinkedIn](https://linkedin.com/company/emotiondome)

</div>
