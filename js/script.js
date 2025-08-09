// =============================================
// GEODESIC EMOTION DOME - ENHANCED MAIN SCRIPT
// =============================================

// Performance monitoring
const performanceMonitor = {
    fps: 0,
    frameCount: 0,
    lastTime: performance.now(),
    
    update() {
        this.frameCount++;
        const currentTime = performance.now();
        if (currentTime >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
    }
};

// State Management System
class StateManager {
    constructor() {
        this.state = {
            isLoading: true,
            isFirstVisit: this.checkFirstVisit(),
            selectedCategory: 'all',
            selectedNode: null,
            hoveredNode: null,
            searchQuery: '',
            viewMode: '3d', // '3d', 'graph', 'analytics'
            theme: 'dark',
            emotionalJourney: [],
            connectionStrength: new Map(),
            nodeVisits: new Map()
        };
        
        this.listeners = new Map();
        this.history = [];
        this.maxHistorySize = 50;
    }
    
    checkFirstVisit() {
        const visited = localStorage.getItem('emotionDomeVisited');
        if (!visited) {
            localStorage.setItem('emotionDomeVisited', 'true');
            return true;
        }
        return false;
    }
    
    setState(updates) {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...updates };
        this.history.push(prevState);
        
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        }
        
        this.notifyListeners(updates);
    }
    
    getState(key) {
        return key ? this.state[key] : this.state;
    }
    
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
    }
    
    notifyListeners(updates) {
        Object.keys(updates).forEach(key => {
            if (this.listeners.has(key)) {
                this.listeners.get(key).forEach(callback => callback(updates[key]));
            }
        });
    }
    
    undo() {
        if (this.history.length > 0) {
            this.state = this.history.pop();
            this.notifyListeners(this.state);
        }
    }
    
    saveToLocalStorage() {
        const persistentState = {
            theme: this.state.theme,
            emotionalJourney: this.state.emotionalJourney,
            nodeVisits: Array.from(this.state.nodeVisits.entries())
        };
        localStorage.setItem('emotionDomeState', JSON.stringify(persistentState));
    }
    
    loadFromLocalStorage() {
        const saved = localStorage.getItem('emotionDomeState');
        if (saved) {
            const data = JSON.parse(saved);
            this.state.theme = data.theme || 'dark';
            this.state.emotionalJourney = data.emotionalJourney || [];
            this.state.nodeVisits = new Map(data.nodeVisits || []);
        }
    }
}

// Global state instance
const stateManager = new StateManager();

// Enhanced Emotion Data Structure with relationships and metadata
const emotionsData = [
    // Joy & Happiness Cluster
    { 
        id: 'joy', 
        name: 'Joy', 
        category: 'joy', 
        color: '#FFD700',
        desc: 'Pure happiness and delight',
        connections: ['excitement', 'gratitude', 'love', 'hope'],
        strength: 85,
        valence: 0.9,
        arousal: 0.7,
        keywords: ['happy', 'cheerful', 'delighted', 'pleased'],
        quote: 'Joy is the simplest form of gratitude',
        position: null
    },
    { 
        id: 'excitement', 
        name: 'Excitement', 
        category: 'joy', 
        color: '#FFA500',
        desc: 'Energetic anticipation and enthusiasm',
        connections: ['joy', 'hope', 'curiosity'],
        strength: 75,
        valence: 0.8,
        arousal: 0.9,
        keywords: ['thrilled', 'eager', 'enthusiastic', 'animated'],
        quote: 'Excitement is the electricity of life',
        position: null
    },
    { 
        id: 'gratitude', 
        name: 'Gratitude', 
        category: 'joy', 
        color: '#FFB347',
        desc: 'Thankfulness and appreciation',
        connections: ['joy', 'love', 'peace'],
        strength: 80,
        valence: 0.8,
        arousal: 0.4,
        keywords: ['thankful', 'appreciative', 'blessed', 'grateful'],
        quote: 'Gratitude turns what we have into enough',
        position: null
    },
    
    // Love & Connection Cluster
    { 
        id: 'love', 
        name: 'Love', 
        category: 'love', 
        color: '#FF69B4',
        desc: 'Deep affection and connection',
        connections: ['joy', 'compassion', 'trust', 'gratitude'],
        strength: 90,
        valence: 0.9,
        arousal: 0.5,
        keywords: ['affection', 'caring', 'devotion', 'warmth'],
        quote: 'Love is the bridge between souls',
        position: null
    },
    { 
        id: 'compassion', 
        name: 'Compassion', 
        category: 'love', 
        color: '#FF1493',
        desc: 'Empathy and concern for others',
        connections: ['love', 'sadness', 'hope'],
        strength: 70,
        valence: 0.6,
        arousal: 0.3,
        keywords: ['empathy', 'kindness', 'sympathy', 'understanding'],
        quote: 'Compassion is love in action',
        position: null
    },
    { 
        id: 'trust', 
        name: 'Trust', 
        category: 'love', 
        color: '#C71585',
        desc: 'Faith and confidence in others',
        connections: ['love', 'peace', 'hope'],
        strength: 75,
        valence: 0.7,
        arousal: 0.2,
        keywords: ['faith', 'confidence', 'reliability', 'security'],
        quote: 'Trust is the foundation of connection',
        position: null
    },
    
    // Sadness & Melancholy Cluster
    { 
        id: 'sadness', 
        name: 'Sadness', 
        category: 'sadness', 
        color: '#4169E1',
        desc: 'Sorrow and unhappiness',
        connections: ['grief', 'loneliness', 'compassion', 'nostalgia'],
        strength: 60,
        valence: -0.6,
        arousal: -0.3,
        keywords: ['sorrowful', 'unhappy', 'melancholy', 'blue'],
        quote: 'Sadness is love with nowhere to go',
        position: null
    },
    { 
        id: 'grief', 
        name: 'Grief', 
        category: 'sadness', 
        color: '#191970',
        desc: 'Deep sorrow from loss',
        connections: ['sadness', 'anger', 'loneliness'],
        strength: 45,
        valence: -0.8,
        arousal: -0.5,
        keywords: ['mourning', 'loss', 'bereavement', 'anguish'],
        quote: 'Grief is love persevering',
        position: null
    },
    { 
        id: 'loneliness', 
        name: 'Loneliness', 
        category: 'sadness', 
        color: '#6495ED',
        desc: 'Isolation and disconnection',
        connections: ['sadness', 'fear', 'grief'],
        strength: 50,
        valence: -0.7,
        arousal: -0.4,
        keywords: ['isolated', 'alone', 'disconnected', 'abandoned'],
        quote: 'Loneliness is the human condition',
        position: null
    },
    { 
        id: 'nostalgia', 
        name: 'Nostalgia', 
        category: 'sadness', 
        color: '#4682B4',
        desc: 'Bittersweet longing for the past',
        connections: ['sadness', 'joy', 'peace'],
        strength: 65,
        valence: 0.1,
        arousal: -0.2,
        keywords: ['wistful', 'reminiscent', 'yearning', 'sentimental'],
        quote: 'Nostalgia is memory with the pain removed',
        position: null
    },
    
    // Anger & Frustration Cluster
    { 
        id: 'anger', 
        name: 'Anger', 
        category: 'anger', 
        color: '#DC143C',
        desc: 'Strong displeasure and hostility',
        connections: ['frustration', 'fear', 'grief'],
        strength: 70,
        valence: -0.7,
        arousal: 0.8,
        keywords: ['furious', 'enraged', 'irritated', 'mad'],
        quote: 'Anger is sadness that had nowhere to go for too long',
        position: null
    },
    { 
        id: 'frustration', 
        name: 'Frustration', 
        category: 'anger', 
        color: '#B22222',
        desc: 'Feeling blocked or thwarted',
        connections: ['anger', 'anxiety', 'determination'],
        strength: 65,
        valence: -0.5,
        arousal: 0.6,
        keywords: ['annoyed', 'exasperated', 'impatient', 'thwarted'],
        quote: 'Frustration is the first step towards improvement',
        position: null
    },
    { 
        id: 'jealousy', 
        name: 'Jealousy', 
        category: 'anger', 
        color: '#8B0000',
        desc: 'Envy and resentment',
        connections: ['anger', 'fear', 'sadness'],
        strength: 55,
        valence: -0.6,
        arousal: 0.5,
        keywords: ['envious', 'resentful', 'covetous', 'suspicious'],
        quote: 'Jealousy is the art of counting others\' blessings',
        position: null
    },
    
    // Fear & Anxiety Cluster
    { 
        id: 'fear', 
        name: 'Fear', 
        category: 'fear', 
        color: '#8B008B',
        desc: 'Apprehension of danger',
        connections: ['anxiety', 'anger', 'loneliness'],
        strength: 60,
        valence: -0.8,
        arousal: 0.7,
        keywords: ['afraid', 'scared', 'terrified', 'fearful'],
        quote: 'Fear is excitement without breath',
        position: null
    },
    { 
        id: 'anxiety', 
        name: 'Anxiety', 
        category: 'fear', 
        color: '#9932CC',
        desc: 'Worry about future uncertainty',
        connections: ['fear', 'frustration', 'overwhelm'],
        strength: 65,
        valence: -0.6,
        arousal: 0.6,
        keywords: ['worried', 'nervous', 'uneasy', 'tense'],
        quote: 'Anxiety is the dizziness of freedom',
        position: null
    },
    { 
        id: 'overwhelm', 
        name: 'Overwhelm', 
        category: 'fear', 
        color: '#9370DB',
        desc: 'Feeling unable to cope',
        connections: ['anxiety', 'sadness', 'frustration'],
        strength: 55,
        valence: -0.7,
        arousal: 0.4,
        keywords: ['overloaded', 'swamped', 'stressed', 'burdened'],
        quote: 'When overwhelmed, return to breath',
        position: null
    },
    
    // Calm & Peace Cluster
    { 
        id: 'peace', 
        name: 'Peace', 
        category: 'calm', 
        color: '#20B2AA',
        desc: 'Tranquility and serenity',
        connections: ['trust', 'gratitude', 'acceptance'],
        strength: 80,
        valence: 0.7,
        arousal: -0.5,
        keywords: ['tranquil', 'serene', 'calm', 'relaxed'],
        quote: 'Peace begins with a smile',
        position: null
    },
    { 
        id: 'acceptance', 
        name: 'Acceptance', 
        category: 'calm', 
        color: '#48D1CC',
        desc: 'Embracing what is',
        connections: ['peace', 'trust', 'hope'],
        strength: 75,
        valence: 0.5,
        arousal: -0.3,
        keywords: ['accepting', 'allowing', 'embracing', 'surrendering'],
        quote: 'Acceptance is the first step to change',
        position: null
    },
    { 
        id: 'hope', 
        name: 'Hope', 
        category: 'calm', 
        color: '#00CED1',
        desc: 'Optimism for the future',
        connections: ['joy', 'trust', 'excitement', 'compassion'],
        strength: 85,
        valence: 0.8,
        arousal: 0.3,
        keywords: ['optimistic', 'hopeful', 'confident', 'positive'],
        quote: 'Hope is the thing with feathers',
        position: null
    },
    { 
        id: 'curiosity', 
        name: 'Curiosity', 
        category: 'calm', 
        color: '#5F9EA0',
        desc: 'Wonder and desire to explore',
        connections: ['excitement', 'hope', 'joy'],
        strength: 70,
        valence: 0.6,
        arousal: 0.4,
        keywords: ['interested', 'inquisitive', 'wondering', 'exploring'],
        quote: 'Curiosity is the wick in the candle of learning',
        position: null
    },
    { 
        id: 'determination', 
        name: 'Determination', 
        category: 'calm', 
        color: '#008B8B',
        desc: 'Resolve and persistence',
        connections: ['hope', 'frustration', 'courage'],
        strength: 80,
        valence: 0.4,
        arousal: 0.5,
        keywords: ['determined', 'persistent', 'resolute', 'committed'],
        quote: 'Determination is the wake-up call to the human will',
        position: null
    },
    { 
        id: 'courage', 
        name: 'Courage', 
        category: 'calm', 
        color: '#006666',
        desc: 'Bravery in facing challenges',
        connections: ['determination', 'fear', 'hope'],
        strength: 85,
        valence: 0.6,
        arousal: 0.6,
        keywords: ['brave', 'bold', 'fearless', 'valiant'],
        quote: 'Courage is fear walking',
        position: null
    }
];

// Sound Manager (using Howler.js)
class SoundManager {
    constructor() {
        this.sounds = {
            hover: new Howl({
                src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+0fPTgjMGHm7A7+OZURE...'],
                volume: 0.3
            }),
            click: new Howl({
                src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+0fPTgjMGHm7A7+OZURE...'],
                volume: 0.5
            }),
            ambient: new Howl({
                src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+0fPTgjMGHm7A7+OZURE...'],
                volume: 0.1,
                loop: true
            })
        };
    }
    
    playHover() {
        if (settings.soundEnabled) this.sounds.hover.play();
    }
    
    playClick() {
        if (settings.soundEnabled) this.sounds.click.play();
    }
    
    toggleAmbient(enabled) {
        if (enabled) {
            this.sounds.ambient.play();
        } else {
            this.sounds.ambient.stop();
        }
    }
}

const soundManager = new SoundManager();

// Initialize Three.js Scene
function initScene() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0e27, 10, 50);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 15);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Post-processing
    setupPostProcessing();
    
    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.8;
    controls.minDistance = 8;
    controls.maxDistance = 30;
    controls.autoRotate = settings.autoRotate;
    controls.autoRotateSpeed = 0.5;
    
    // Lighting
    setupLighting();
    
    // Raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
}

// Setup post-processing effects
function setupPostProcessing() {
    composer = new THREE.EffectComposer(renderer);
    
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.5,  // Bloom strength
        0.4,  // Bloom radius
        0.85  // Bloom threshold
    );
    composer.addPass(bloomPass);
}

// Setup lighting
function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    // Point lights for color accents
    const pointLight1 = new THREE.PointLight(0x667eea, 0.5, 20);
    pointLight1.position.set(-10, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x764ba2, 0.5, 20);
    pointLight2.position.set(10, -5, -5);
    scene.add(pointLight2);
    
    // Animated point light
    const movingLight = new THREE.PointLight(0xffffff, 0.3, 15);
    scene.add(movingLight);
    
    // Store for animation
    scene.userData.movingLight = movingLight;
}

// Create geodesic dome structure
function createGeodesicDome() {
    const radius = 6;
    const detail = 2;
    const geometry = new THREE.IcosahedronGeometry(radius, detail);
    
    // Create emotion nodes
    const positions = geometry.attributes.position;
    const usedIndices = new Set();
    
    emotionsData.forEach((emotion, index) => {
        // Find unique vertex position
        let vertexIndex;
        do {
            vertexIndex = Math.floor(Math.random() * positions.count);
        } while (usedIndices.has(vertexIndex) && usedIndices.size < positions.count);
        usedIndices.add(vertexIndex);
        
        const x = positions.array[vertexIndex * 3];
        const y = positions.array[vertexIndex * 3 + 1];
        const z = positions.array[vertexIndex * 3 + 2];
        
        createEmotionNode(emotion, x, y, z);
    });
    
    // Create connections
    createConnections();
    
    // Create particle system
    if (settings.particleEffects) {
        createParticles();
    }
    
    // Update stats
    updateStats();
}

// Create individual emotion node
function createEmotionNode(emotion, x, y, z) {
    const nodeGroup = new THREE.Group();
    
    // Main sphere
    const sphereGeometry = new THREE.SphereGeometry(0.2 * settings.nodeSize, 32, 32);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
        color: emotion.color,
        emissive: emotion.color,
        emissiveIntensity: 0.3,
        metalness: 0.3,
        roughness: 0.4,
        clearcoat: 1,
        clearcoatRoughness: 0.1
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    
    // Glow effect
    const glowGeometry = new THREE.SphereGeometry(0.25 * settings.nodeSize, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: emotion.color,
        transparent: true,
        opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    
    // Add to group
    nodeGroup.add(sphere);
    nodeGroup.add(glow);
    nodeGroup.position.set(x, y, z);
    nodeGroup.userData = emotion;
    
    // Create label
    if (settings.showLabels) {
        createLabel(emotion.name, nodeGroup);
    }
    
    // Store reference
    emotionNodes.push({
        group: nodeGroup,
        sphere: sphere,
        glow: glow,
        emotion: emotion,
        originalPosition: new THREE.Vector3(x, y, z)
    });
    
    scene.add(nodeGroup);
}

// Create text label for node
function createLabel(text, parentGroup) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    // Draw text
    context.font = 'Bold 48px Inter';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 256, 64);
    
    // Create sprite
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.y = 0.4;
    sprite.scale.set(1, 0.25, 1);
    
    parentGroup.add(sprite);
    parentGroup.userData.label = sprite;
}

// Create connections between emotions
function createConnections() {
    // Clear existing connections
    connections.forEach(conn => scene.remove(conn.line));
    connections = [];
    
    emotionNodes.forEach(nodeData => {
        const emotion = nodeData.emotion;
        
        emotion.connections.forEach(targetId => {
            const targetNode = emotionNodes.find(n => n.emotion.id === targetId);
            
            if (targetNode) {
                // Create curved connection
                const curve = new THREE.CatmullRomCurve3([
                    nodeData.group.position,
                    new THREE.Vector3(
                        (nodeData.group.position.x + targetNode.group.position.x) / 2,
                        (nodeData.group.position.y + targetNode.group.position.y) / 2 + 1,
                        (nodeData.group.position.z + targetNode.group.position.z) / 2
                    ),
                    targetNode.group.position
                ]);
                
                const points = curve.getPoints(50);
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                
                const material = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    opacity: settings.connectionOpacity,
                    transparent: true,
                    linewidth: 1
                });
                
                const line = new THREE.Line(geometry, material);
                line.userData = {
                    from: emotion,
                    to: targetNode.emotion,
                    fromNode: nodeData,
                    toNode: targetNode
                };
                
                connections.push({ line, material });
                scene.add(line);
            }
        });
    });
}

// Create particle system for ambiance
function createParticles() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Random position in sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 8 + Math.random() * 12;
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        // Random color (purple to blue gradient)
        colors[i3] = 0.4 + Math.random() * 0.3;
        colors[i3 + 1] = 0.3 + Math.random() * 0.3;
        colors[i3 + 2] = 0.9 + Math.random() * 0.1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Handle mouse movement
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(
        emotionNodes.map(n => n.sphere)
    );
    
    if (intersects.length > 0) {
        const intersectedNode = emotionNodes.find(
            n => n.sphere === intersects[0].object
        );
        
        if (hoveredNode !== intersectedNode) {
            // Reset previous hover
            if (hoveredNode) {
                gsap.to(hoveredNode.group.scale, {
                    x: 1, y: 1, z: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
            
            // Apply hover effect
            hoveredNode = intersectedNode;
            gsap.to(hoveredNode.group.scale, {
                x: 1.3, y: 1.3, z: 1.3,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Play hover sound
            soundManager.playHover();
            
            // Update info panel
            updateInfoPanel(hoveredNode.emotion);
            
            // Highlight connections
            highlightConnections(hoveredNode.emotion);
        }
    } else {
        if (hoveredNode && hoveredNode !== selectedNode) {
            gsap.to(hoveredNode.group.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            hoveredNode = null;
            
            if (!selectedNode) {
                hideInfoPanel();
                resetConnections();
            }
        }
    }
}

// Handle mouse click
function onMouseClick(event) {
    if (hoveredNode) {
        selectedNode = hoveredNode;
        soundManager.playClick();
        
        // Focus camera on node
        const targetPosition = hoveredNode.group.position.clone();
        gsap.to(controls.target, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 1,
            ease: "power2.inOut"
        });
        
        // Keep info panel visible
        updateInfoPanel(selectedNode.emotion);
    } else {
        selectedNode = null;
    }
}

// Update info panel with emotion data
function updateInfoPanel(emotion) {
    const panel = document.getElementById('infoPanel');
    
    document.getElementById('emotionName').textContent = emotion.name;
    document.getElementById('emotionDesc').textContent = emotion.desc;
    document.getElementById('connectionCount').textContent = emotion.connections.length;
    document.getElementById('emotionCategory').textContent = 
        emotion.category.charAt(0).toUpperCase() + emotion.category.slice(1);
    document.getElementById('emotionStrength').textContent = emotion.strength + '%';
    
    // Update connections list
    const connectionsList = document.getElementById('connectionsList');
    connectionsList.innerHTML = emotion.connections
        .map(connId => {
            const connEmotion = emotionsData.find(e => e.id === connId);
            return `<span class="connection-tag">${connEmotion.name}</span>`;
        })
        .join('');
    
    panel.classList.add('visible');
}

// Hide info panel
function hideInfoPanel() {
    document.getElementById('infoPanel').classList.remove('visible');
}

// Highlight connections for an emotion
function highlightConnections(emotion) {
    connections.forEach(conn => {
        if (conn.line.userData.from === emotion || 
            conn.line.userData.to === emotion) {
            gsap.to(conn.material, {
                opacity: 0.8,
                duration: 0.3
            });
            conn.material.color = new THREE.Color(emotion.color);
        } else {
            gsap.to(conn.material, {
                opacity: 0.1,
                duration: 0.3
            });
        }
    });
}

// Reset connection highlighting
function resetConnections() {
    connections.forEach(conn => {
        gsap.to(conn.material, {
            opacity: settings.connectionOpacity,
            duration: 0.3
        });
        conn.material.color = new THREE.Color(0xffffff);
    });
}

// Filter by category
function filterByCategory(category) {
    selectedCategory = category;
    
    emotionNodes.forEach(nodeData => {
        if (category === 'all' || nodeData.emotion.category === category) {
            gsap.to(nodeData.sphere.material, {
                opacity: 1,
                duration: 0.5
            });
            if (nodeData.group.userData.label) {
                gsap.to(nodeData.group.userData.label.material, {
                    opacity: 0.9,
                    duration: 0.5
                });
            }
        } else {
            gsap.to(nodeData.sphere.material, {
                opacity: 0.2,
                duration: 0.5
            });
            if (nodeData.group.userData.label) {
                gsap.to(nodeData.group.userData.label.material, {
                    opacity: 0.2,
                    duration: 0.5
                });
            }
        }
    });
    
    // Update connections
    connections.forEach(conn => {
        const fromMatch = category === 'all' || conn.line.userData.from.category === category;
        const toMatch = category === 'all' || conn.line.userData.to.category === category;
        
        if (fromMatch || toMatch) {
            gsap.to(conn.material, {
                opacity: settings.connectionOpacity,
                duration: 0.5
            });
        } else {
            gsap.to(conn.material, {
                opacity: 0.05,
                duration: 0.5
            });
        }
    });
    
    // Update active category display
    document.getElementById('activeCategory').textContent = 
        category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1);
}

// Update statistics display
function updateStats() {
    document.getElementById('totalNodes').textContent = emotionNodes.length;
    document.getElementById('totalConnections').textContent = connections.length;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Animate nodes
    const time = Date.now() * 0.001;
    emotionNodes.forEach((nodeData, index) => {
        if (nodeData !== hoveredNode && nodeData !== selectedNode) {
            const pulseScale = 1 + Math.sin(time * settings.animationSpeed + index) * 0.05;
            nodeData.glow.scale.set(pulseScale, pulseScale, pulseScale);
        }
        
        // Float animation
        nodeData.group.position.y = 
            nodeData.originalPosition.y + Math.sin(time * 0.5 + index) * 0.1;
    });
    
    // Animate particles
    if (particles) {
        particles.rotation.y += 0.0002;
    }
    
    // Animate moving light
    if (scene.userData.movingLight) {
        scene.userData.movingLight.position.x = Math.sin(time * 0.5) * 10;
        scene.userData.movingLight.position.y = Math.cos(time * 0.3) * 10;
        scene.userData.movingLight.position.z = Math.sin(time * 0.7) * 10;
    }
    
    // Render scene
    composer.render();
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize UI controls
function initUIControls() {
    // Category filters
    document.querySelectorAll('.emotion-category').forEach(element => {
        element.addEventListener('click', function() {
            // Remove active class from all
            document.querySelectorAll('.emotion-category').forEach(el => {
                el.classList.remove('active');
            });
            
            // Add active class to clicked
            this.classList.add('active');
            
            // Apply filter
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Reset view button
    document.getElementById('resetView').addEventListener('click', () => {
        gsap.to(controls.target, {
            x: 0, y: 0, z: 0,
            duration: 1,
            ease: "power2.inOut"
        });
        
        gsap.to(camera.position, {
            x: 0, y: 0, z: 15,
            duration: 1,
            ease: "power2.inOut"
        });
        
        selectedNode = null;
        hideInfoPanel();
        resetConnections();
    });
    
    // Settings modal
    const settingsModal = document.getElementById('settingsModal');
    
    document.getElementById('toggleSettings').addEventListener('click', () => {
        settingsModal.classList.add('active');
    });
    
    document.getElementById('closeSettings').addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });
    
    // Settings controls
    document.getElementById('animationSpeed').addEventListener('input', function() {
        settings.animationSpeed = this.value / 100;
        this.nextElementSibling.textContent = this.value + '%';
    });
    
    document.getElementById('connectionOpacity').addEventListener('input', function() {
        settings.connectionOpacity = this.value / 100;
        this.nextElementSibling.textContent = this.value + '%';
        connections.forEach(conn => {
            conn.material.opacity = settings.connectionOpacity;
        });
    });
    
    document.getElementById('nodeSize').addEventListener('input', function() {
        settings.nodeSize = this.value / 100;
        this.nextElementSibling.textContent = this.value + '%';
        emotionNodes.forEach(nodeData => {
            const scale = settings.nodeSize;
            nodeData.sphere.scale.set(scale, scale, scale);
            nodeData.glow.scale.set(scale * 1.25, scale * 1.25, scale * 1.25);
        });
    });
    
    document.getElementById('showLabels').addEventListener('change', function() {
        settings.showLabels = this.checked;
        emotionNodes.forEach(nodeData => {
            if (nodeData.group.userData.label) {
                nodeData.group.userData.label.visible = settings.showLabels;
            }
        });
    });
    
    document.getElementById('autoRotate').addEventListener('change', function() {
        settings.autoRotate = this.checked;
        controls.autoRotate = settings.autoRotate;
    });
    
    document.getElementById('particleEffects').addEventListener('change', function() {
        settings.particleEffects = this.checked;
        if (particles) {
            particles.visible = settings.particleEffects;
        }
    });
    
    // Sound toggle
    document.getElementById('toggleSound').addEventListener('click', function() {
        settings.soundEnabled = !settings.soundEnabled;
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        icon.className = settings.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        soundManager.toggleAmbient(settings.soundEnabled);
    });
    
    // Fullscreen toggle
    document.getElementById('toggleFullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
    
    // Close info panel
    document.getElementById('closeInfo').addEventListener('click', () => {
        selectedNode = null;
        hideInfoPanel();
        resetConnections();
    });
}

// Initialize application with enhanced error handling
async function init() {
    try {
        // Show welcome modal for first-time visitors
        if (stateManager.getState('isFirstVisit')) {
            showWelcomeModal();
        }
        
        // Load saved state
        stateManager.loadFromLocalStorage();
        
        // Initialize Three.js scene
        await initScene();
        
        // Create dome structure
        await createGeodesicDome();
        
        // Initialize UI controls
        initUIControls();
        
        // Setup keyboard shortcuts
        setupKeyboardShortcuts();
        
        // Setup search functionality
        setupSearch();
        
        // Initialize tooltips
        initTooltips();
        
        // Event listeners
        setupEventListeners();
        
        // Start performance monitoring
        if (settings.showPerformance) {
            startPerformanceMonitoring();
        }
        
        // Hide loader with animation
        hideLoader();
        
        // Start animation loop
        animate();
        
        // Play ambient sound if enabled
        if (settings.soundEnabled) {
            soundManager.toggleAmbient(true);
        }
        
        // Analytics
        trackEvent('app_initialized', {
            nodes: emotionNodes.length,
            connections: connections.length
        });
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showErrorMessage('Failed to load the Emotion Dome. Please refresh the page.');
    }
}

// Enhanced keyboard shortcuts
function setupKeyboardShortcuts() {
    const shortcuts = {
        'Escape': () => {
            stateManager.setState({ selectedNode: null });
            resetView();
        },
        'Space': (e) => {
            e.preventDefault();
            settings.autoRotate = !settings.autoRotate;
            controls.autoRotate = settings.autoRotate;
        },
        'KeyF': (e) => {
            if (!e.ctrlKey && !e.metaKey) {
                toggleFullscreen();
            }
        },
        'KeyS': () => {
            settings.soundEnabled = !settings.soundEnabled;
            updateSoundButton();
        },
        'KeyH': () => {
            showHelp();
        },
        'KeyR': () => {
            resetView();
        },
        'Slash': (e) => {
            e.preventDefault();
            document.getElementById('emotionSearch').focus();
        },
        'ArrowLeft': () => navigateCategory(-1),
        'ArrowRight': () => navigateCategory(1),
        'KeyZ': (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                stateManager.undo();
            }
        },
        'Digit1': () => filterByCategory('all'),
        'Digit2': () => filterByCategory('joy'),
        'Digit3': () => filterByCategory('love'),
        'Digit4': () => filterByCategory('sadness'),
        'Digit5': () => filterByCategory('anger'),
        'Digit6': () => filterByCategory('fear'),
        'Digit7': () => filterByCategory('calm')
    };
    
    document.addEventListener('keydown', (e) => {
        if (shortcuts[e.code]) {
            shortcuts[e.code](e);
        }
    });
}

// Navigate between categories with keyboard
function navigateCategory(direction) {
    const categories = ['all', 'joy', 'love', 'sadness', 'anger', 'fear', 'calm'];
    const currentIndex = categories.indexOf(stateManager.getState('selectedCategory'));
    const newIndex = (currentIndex + direction + categories.length) % categories.length;
    filterByCategory(categories[newIndex]);
}

// Enhanced search functionality
function setupSearch() {
    const searchInput = document.getElementById('emotionSearch');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase();
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300); // Debounce search
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const results = performSearch(searchInput.value.toLowerCase());
            if (results.length > 0) {
                focusOnNode(results[0]);
            }
        }
    });
}

// Perform emotion search
function performSearch(query) {
    stateManager.setState({ searchQuery: query });
    
    if (!query) {
        // Reset all nodes visibility
        emotionNodes.forEach(node => {
            gsap.to(node.sphere.material, {
                opacity: 1,
                duration: 0.3
            });
        });
        return [];
    }
    
    const results = [];
    
    emotionNodes.forEach(node => {
        const emotion = node.emotion;
        const match = 
            emotion.name.toLowerCase().includes(query) ||
            emotion.desc.toLowerCase().includes(query) ||
            emotion.keywords.some(k => k.includes(query)) ||
            emotion.category.includes(query);
        
        if (match) {
            results.push(node);
            gsap.to(node.sphere.material, {
                opacity: 1,
                duration: 0.3
            });
            // Pulse effect for matches
            gsap.to(node.group.scale, {
                x: 1.2,
                y: 1.2,
                z: 1.2,
                duration: 0.5,
                yoyo: true,
                repeat: 1
            });
        } else {
            gsap.to(node.sphere.material, {
                opacity: 0.2,
                duration: 0.3
            });
        }
    });
    
    updateSearchResults(results);
    return results;
}

// Update search results display
function updateSearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    if (results.length === 0 && stateManager.getState('searchQuery')) {
        resultsContainer.innerHTML = '<p class="no-results">No emotions found</p>';
    } else if (results.length > 0) {
        resultsContainer.innerHTML = `
            <p class="results-count">${results.length} emotion${results.length > 1 ? 's' : ''} found</p>
            <div class="results-list">
                ${results.map(node => `
                    <div class="result-item" data-id="${node.emotion.id}">
                        <span class="result-name">${node.emotion.name}</span>
                        <span class="result-category">${node.emotion.category}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add click handlers to results
        resultsContainer.querySelectorAll('.result-item').forEach(item => {
            item.addEventListener('click', () => {
                const nodeId = item.dataset.id;
                const node = emotionNodes.find(n => n.emotion.id === nodeId);
                if (node) focusOnNode(node);
            });
        });
    } else {
        resultsContainer.innerHTML = '';
    }
}

// Initialize tooltips using Tippy.js
function initTooltips() {
    // Category tooltips
    tippy('.emotion-category', {
        content: (element) => {
            const category = element.dataset.category;
            const count = element.querySelector('.category-count').textContent;
            return `Click to filter by ${category} emotions (${count})`;
        },
        placement: 'right',
        theme: 'light'
    });
    
    // Control button tooltips
    tippy('#toggleSound', {
        content: 'Toggle sound (S)',
        placement: 'bottom'
    });
    
    tippy('#toggleFullscreen', {
        content: 'Fullscreen (F)',
        placement: 'bottom'
    });
    
    tippy('#toggleSettings', {
        content: 'Settings',
        placement: 'bottom'
    });
    
    tippy('#resetView', {
        content: 'Reset view (R)',
        placement: 'top'
    });
}

// Enhanced loader hiding with progress animation
function hideLoader() {
    const loader = document.getElementById('loader');
    const progressBar = loader.querySelector('.loader-progress-bar');
    const percentage = loader.querySelector('.loader-percentage');
    
    // Animate progress to 100%
    gsap.to(progressBar, {
        width: '100%',
        duration: 1,
        ease: 'power2.out',
        onUpdate: function() {
            const progress = Math.round(this.progress() * 100);
            if (percentage) {
                percentage.textContent = `${progress}%`;
            }
        },
        onComplete: () => {
            // Fade out loader
            gsap.to(loader, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    loader.classList.add('hidden');
                    stateManager.setState({ isLoading: false });
                }
            });
        }
    });
}

// Show welcome modal
function showWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (!modal) return;
    
    modal.classList.add('active');
    
    document.getElementById('startExperience').addEventListener('click', () => {
        modal.classList.remove('active');
        trackEvent('welcome_completed');
    });
}

// Analytics tracking
function trackEvent(eventName, data = {}) {
    // Implement your analytics tracking here
    console.log('Track event:', eventName, data);
    
    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
    }
}

// Error handling
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Start application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
