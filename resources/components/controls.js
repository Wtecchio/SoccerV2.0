import { camera, renderer } from './scene.js';
import { OrbitControls } from '../jsLib/OrbitControls.js';  // Adjust the path if needed

const controls = new OrbitControls(camera, renderer.domElement);

// Optionally, set some initial parameters
controls.target.set(59, 1.5, -118.15);  // Set the point to look at. Default is (0, 0, 0)
controls.minDistance = 10;     // Minimum zoom distance
controls.maxDistance = 500;    // Maximum zoom distance

function initControls() {
    // Any control-specific initialization can go here
}

function updateControls() {
    // If you want the camera to always look at the center of the scene (or any other point)
    controls.update();
}

export { initControls, updateControls };
