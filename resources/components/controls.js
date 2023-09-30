import * as THREE from 'three';
import { camera, renderer } from './scene.js';
import { OrbitControls } from '../jsLib/OrbitControls.js';  // Adjust the path if needed
import { player } from './player.js';  // Import your player object


//ORBITAL CAMERA DISTANCE OPTIONS AND CRATIONS
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 5;  // Feel free to adjust these
controls.maxDistance = 10;



// Initialize an object to store key states
const keyState = {
    w: false,
    a: false,
    s: false,
    d: false,
};

// Listen for keydown events
document.addEventListener('keydown', function (event) {
    switch (event.code) {
        case 'KeyW':
            keyState.w = true;
            break;
        case 'KeyA':
            keyState.a = true;
            break;
        case 'KeyS':
            keyState.s = true;
            break;
        case 'KeyD':
            keyState.d = true;
            break;
    }
});

// Listen for keyup events
document.addEventListener('keyup', function (event) {
    switch (event.code) {
        case 'KeyW':
            keyState.w = false;
            break;
        case 'KeyA':
            keyState.a = false;
            break;
        case 'KeyS':
            keyState.s = false;
            break;
        case 'KeyD':
            keyState.d = false;
            break;
    }
});


/* ORIGINAL CAMERA FOR CENTER OF FIELD
// Optionally, set some initial parameters
controls.target.set(59, 1.5, -118.15);  // Set the point to look at. Default is (0, 0, 0)
controls.minDistance = 10;     // Minimum zoom distance
controls.maxDistance = 500;    // Maximum zoom distance
*/

function initControls() {
    // Any control-specific initialization can go here
}

function updateControls() {


        // If you want the camera to follow the player
        if (player) {



        // You can still adjust the camera position here if needed
        // camera.position.x = player.position.x + offset.x;  // example
        // camera.position.y = player.position.y + offset.y;  // example
         //camera.position.z = player.position.z + 5s;  // example
            //camera.lookAt(player.position);


            // Update player position based on key states
            if (keyState.w) player.position.z += 0.1;
            if (keyState.s) player.position.z -= 0.1;
            if (keyState.a) player.position.x += 0.1;
            if (keyState.d) player.position.x -= 0.1;



            // Update the OrbitControls target to the player's new position
            controls.target.copy(player.position);

            // Force OrbitControls to update
            controls.update();
        }
    }

export { initControls, updateControls };
