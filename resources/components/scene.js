import * as THREE from 'three';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(60, 1.5, -120);  // Set an initial camera position
camera.lookAt(60, 1.5, -120);  // Make the camera look at the center of the scene

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Handle window resize
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});




// Add a global ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

// This function can be used to add any other scene-wide settings or objects
function initScene() {
    // Any other scene-wide initialization can go here
}

export { scene, camera, renderer, initScene };