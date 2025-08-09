// =============================================
// GEODESIC EMOTION DOME - MAIN SCRIPT (FIXED)
// =============================================

// Global Variables - Properly declared
let scene, camera, renderer, controls, composer;
let emotionNodes = [];
let connections = [];
let particles = null;
let raycaster, mouse;
let nodeGroup, connectionGroup;

// Settings object
const settings = {
    animationSpeed: 0.5,
    connectionOpacity: 0.3,
    nodeSize: 1,
    showLabels: true,
    autoRotate: true,
    particleEffects: true,
    soundEnabled: false, // Start with sound disabled
    showPerformance: false
};

// Simple State Management (simplified for reliability)
const appState = {
    isLoading: true,
    isFirstVisit: false,
    selectedCategory: 'all',
    selectedNode: null,
    hoveredNode: null,
    searchQuery: ''
};

// Enhanced Emotion Data Structure
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
        quote: 'Joy is the simplest form of gratitude'
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
        quote: 'Excitement is the electricity of life'
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
        quote: 'Gratitude turns what we have into enough'
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
        quote: 'Love is the bridge between souls'
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
        quote: 'Compassion is love in action'
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
        quote: 'Trust is the foundation of connection'
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
        quote: 'Sadness is love with nowhere to go'
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
        quote: 'Grief is love persevering'
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
        quote: 'Loneliness is the human condition'
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
        quote: 'Nostalgia is memory with the pain removed'
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
        quote: 'Anger is sadness that had nowhere to go for too long'
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
        quote: 'Frustration is the first step towards improvement'
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
        quote: 'Jealousy is the art of counting others\' blessings'
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
        quote: 'Fear is excitement without breath'
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
        quote: 'Anxiety is the dizziness of freedom'
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
        quote: 'When overwhelmed, return to breath'
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
        quote: 'Peace begins with a smile'
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
        quote: 'Acceptance is the first step to change'
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
        quote: 'Hope is the thing with feathers'
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
        quote: 'Curiosity is the wick in the candle of learning'
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
        quote: 'Determination is the wake-up call to the human will'
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
        quote: 'Courage is fear walking'
    }
];

// Initialize Three.js Scene
function initScene() {
    console.log('Initializing scene...');
    
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Controls - Check if OrbitControls is available
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.zoomSpeed = 0.8;
        controls.minDistance = 8;
        controls.maxDistance = 30;
        controls.autoRotate = settings.autoRotate;
        controls.autoRotateSpeed = 0.5;
    } else {
        console.warn('OrbitControls not loaded, using fallback controls');
        setupFallbackControls();
    }
    
    // Lighting
    setupLighting();
    
    // Raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    console.log('Scene initialized successfully');
}

// Fallback controls if OrbitControls fails to load
function setupFallbackControls() {
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    });
    
    // Simple rotation in animate loop
    window.fallbackAnimate = function() {
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;
        
        if (scene) {
            scene.rotation.y += (targetX - scene.rotation.y) * 0.05;
            scene.rotation.x += (targetY - scene.rotation.x) * 0.05;
        }
    };
}

// Setup lighting
function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    // Point lights for color accents
    const pointLight1 = new THREE.PointLight(0x667eea, 0.5, 20);
    pointLight1.position.set(-10, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x764ba2, 0.5, 20);
    pointLight2.position.set(10, -5, -5);
    scene.add(pointLight2);
}

// Create geodesic dome structure
function createGeodesicDome() {
    console.log('Creating geodesic dome...');
    
    const radius = 6;
    const detail = 2;
    const geometry = new THREE.IcosahedronGeometry(radius, detail);
    
    // Create groups for organization
    nodeGroup = new THREE.Group();
    connectionGroup = new THREE.Group();
    
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
    
    scene.add(nodeGroup);
    
    // Create connections after all nodes are created
    createConnections();
    scene.add(connectionGroup);
    
    // Create particle system
    if (settings.particleEffects) {
        createParticles();
    }
    
    console.log('Geodesic dome created successfully');
}

// Create individual emotion node
function createEmotionNode(emotion, x, y, z) {
    const node = new THREE.Group();
    
    // Main sphere
    const sphereGeometry = new THREE.SphereGeometry(0.2 * settings.nodeSize, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: emotion.color,
        emissive: emotion.color,
        emissiveIntensity: 0.3,
        shininess: 100
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
    node.add(sphere);
    node.add(glow);
    node.position.set(x, y, z);
    node.userData = emotion;
    
    // Create label
    if (settings.showLabels) {
        createLabel(emotion.name, node);
    }
    
    // Store reference
    emotionNodes.push({
        group: node,
        sphere: sphere,
        glow: glow,
        emotion: emotion,
        originalPosition: new THREE.Vector3(x, y, z)
    });
    
    nodeGroup.add(node);
}

// Create text label for node
function createLabel(text, parentGroup) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    // Draw text
    context.font = 'Bold 48px Arial';
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
    console.log('Creating connections...');
    
    emotionNodes.forEach(nodeData => {
        const emotion = nodeData.emotion;
        
        emotion.connections.forEach(targetId => {
            const targetNode = emotionNodes.find(n => n.emotion.id === targetId);
            
            if (targetNode) {
                // Create simple line connection
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array([
                    nodeData.group.position.x, nodeData.group.position.y, nodeData.group.position.z,
                    targetNode.group.position.x, targetNode.group.position.y, targetNode.group.position.z
                ]);
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                
                const material = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    opacity: settings.connectionOpacity,
                    transparent: true
                });
                
                const line = new THREE.Line(geometry, material);
                line.userData = {
                    from: emotion,
                    to: targetNode.emotion
                };
                
                connections.push({ line, material });
                connectionGroup.add(line);
            }
        });
    });
    
    console.log(`Created ${connections.length} connections`);
}

// Create particle system
function createParticles() {
    const particleCount = 500; // Reduced for performance
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = 8 + Math.random() * 12;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x667eea,
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
}

// Handle mouse click
function onMouseClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodeGroup.children, true);
    
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const nodeData = emotionNodes.find(n => 
            n.sphere === clickedObject || n.glow === clickedObject
        );
        
        if (nodeData) {
            selectNode(nodeData);
        }
    }
}

// Select a node
function selectNode(nodeData) {
    appState.selectedNode = nodeData;
    updateInfoPanel(nodeData.emotion);
    highlightConnections(nodeData.emotion);
}

// Update info panel
function updateInfoPanel(emotion) {
    const panel = document.getElementById('infoPanel');
    if (!panel) return;
    
    document.getElementById('emotionName').textContent = emotion.name;
    document.getElementById('emotionDesc').textContent = emotion.desc;
    document.getElementById('connectionCount').textContent = emotion.connections.length;
    document.getElementById('emotionCategory').textContent = 
        emotion.category.charAt(0).toUpperCase() + emotion.category.slice(1);
    document.getElementById('emotionStrength').textContent = emotion.strength + '%';
    
    // Update connections list
    const connectionsList = document.getElementById('connectionsList');
    if (connectionsList) {
        connectionsList.innerHTML = emotion.connections
            .map(connId => {
                const connEmotion = emotionsData.find(e => e.id === connId);
                return connEmotion ? `<span class="connection-tag">${connEmotion.name}</span>` : '';
            })
            .join('');
    }
    
    panel.classList.add('visible');
}

// Highlight connections
function highlightConnections(emotion) {
    connections.forEach(conn => {
        if (conn.line.userData.from === emotion || conn.line.userData.to === emotion) {
            conn.material.opacity = 0.8;
            conn.material.color = new THREE.Color(emotion.color);
        } else {
            conn.material.opacity = 0.1;
        }
    });
}

// Reset connections
function resetConnections() {
    connections.forEach(conn => {
        conn.material.opacity = settings.connectionOpacity;
        conn.material.color = new THREE.Color(0xffffff);
    });
}

// Filter by category
function filterByCategory(category) {
    appState.selectedCategory = category;
    
    emotionNodes.forEach(nodeData => {
        if (category === 'all' || nodeData.emotion.category === category) {
            nodeData.sphere.material.opacity = 1;
            if (nodeData.group.userData.label) {
                nodeData.group.userData.label.material.opacity = 0.9;
            }
        } else {
            nodeData.sphere.material.opacity = 0.2;
            if (nodeData.group.userData.label) {
                nodeData.group.userData.label.material.opacity = 0.2;
            }
        }
    });
    
    // Update active category display
    const activeCategoryElement = document.getElementById('activeCategory');
    if (activeCategoryElement) {
        activeCategoryElement.textContent = 
            category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1);
    }
}

// Initialize UI controls
function initUIControls() {
    console.log('Initializing UI controls...');
    
    // Category filters
    document.querySelectorAll('.emotion-category').forEach(element => {
        element.addEventListener('click', function() {
            document.querySelectorAll('.emotion-category').forEach(el => {
                el.classList.remove('active');
            });
            this.classList.add('active');
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Reset view button
    const resetBtn = document.getElementById('resetView');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (controls) {
                controls.reset();
            }
            camera.position.set(0, 0, 15);
            appState.selectedNode = null;
            document.getElementById('infoPanel')?.classList.remove('visible');
            resetConnections();
        });
    }
    
    // Settings modal
    const settingsModal = document.getElementById('settingsModal');
    const toggleSettings = document.getElementById('toggleSettings');
    const closeSettings = document.getElementById('closeSettings');
    
    if (toggleSettings && settingsModal) {
        toggleSettings.addEventListener('click', () => {
            settingsModal.classList.add('active');
        });
    }
    
    if (closeSettings && settingsModal) {
        closeSettings.addEventListener('click', () => {
            settingsModal.classList.remove('active');
        });
    }
    
    // Close info panel
    const closeInfo = document.getElementById('closeInfo');
    if (closeInfo) {
        closeInfo.addEventListener('click', () => {
            appState.selectedNode = null;
            document.getElementById('infoPanel')?.classList.remove('visible');
            resetConnections();
        });
    }
    
    // Welcome modal
    const welcomeModal = document.getElementById('welcomeModal');
    const startButton = document.getElementById('startExperience');
    
    if (startButton && welcomeModal) {
        startButton.addEventListener('click', () => {
            welcomeModal.classList.remove('active');
        });
    }
    
    console.log('UI controls initialized');
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    if (controls && controls.update) {
        controls.update();
    }
    
    // Fallback animation
    if (window.fallbackAnimate) {
        window.fallbackAnimate();
    }
    
    // Animate nodes
    const time = Date.now() * 0.001;
    emotionNodes.forEach((nodeData, index) => {
        // Gentle floating animation
        const floatY = Math.sin(time * 0.5 + index) * 0.05;
        nodeData.group.position.y = nodeData.originalPosition.y + floatY;
        
        // Gentle pulse for glow
        const pulseScale = 1 + Math.sin(time * settings.animationSpeed + index) * 0.05;
        nodeData.glow.scale.set(pulseScale, pulseScale, pulseScale);
    });
    
    // Animate particles
    if (particles) {
        particles.rotation.y += 0.0002;
    }
    
    // Render scene
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Handle window resize
function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Hide loader with proper timing
function hideLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    
    // Ensure minimum loading time for smooth transition
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            loader.classList.add('hidden');
            appState.isLoading = false;
            console.log('Loader hidden');
        }, 500);
    }, 1000);
}

// Main initialization function
function init() {
    console.log('Starting initialization...');
    
    try {
        // Initialize Three.js scene
        initScene();
        
        // Create dome structure
        createGeodesicDome();
        
        // Initialize UI controls
        initUIControls();
        
        // Setup event listeners
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onMouseClick);
        
        // Start animation loop
        animate();
        
        // Hide loader after everything is ready
        hideLoader();
        
        console.log('Initialization complete!');
        
    } catch (error) {
        console.error('Initialization error:', error);
        
        // Show error message to user
        const loader = document.getElementById('loader');
        if (loader) {
            const loaderText = loader.querySelector('.loader-text');
            if (loaderText) {
                loaderText.textContent = 'Error loading application. Please refresh.';
                loaderText.style.color = '#f56565';
            }
        }
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already loaded
    init();
}

// Export for debugging
window.debugEmotionDome = {
    scene,
    camera,
    renderer,
    emotionNodes,
    connections,
    appState,
    settings,
    resetScene: () => {
        location.reload();
    }
};
