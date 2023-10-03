
import * as THREE from 'three';
import { camera, renderer } from './scene.js';
import { OrbitControls } from '../jsLib/OrbitControls.js';  // Adjust the path if needed
import { player } from './player.js';  // Import your player object
import { handleActions } from './actionMapping.js';  // Import handleActions


//ORBITAL CAMERA DISTANCE OPTIONS AND CRATIONS
//THESE CAUSED MY ROTATION CAMERA NOT TO WORK FOR SOME REASON DO NOT UNCOMMENT
//const controls = new OrbitControls(camera, renderer.domElement);
//controls.minDistance = 5;  // Feel free to adjust these
//controls.maxDistance = 10;



// Initialize an object to store key states
const keyState = {
    w: false,
    a: false,
    s: false,
    d: false,
    r: false,
    Control: false,
    Shift: false,
    ' ': false
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

// Listen for keydown event
document.addEventListener('keydown', function (event) {
    if (keyState.hasOwnProperty(event.key)) {
        keyState[event.key] = true;
    }
});

// Listen for keyup event
document.addEventListener('keyup', function (event) {
    if (keyState.hasOwnProperty(event.key)) {
        keyState[event.key] = false;
    }
});

function initControls() {
    // Any control-specific initialization can go here
}


//VARIABLES FOR SPHERE AROUND PLAYER AND CAMERA CLAMPS SUPER IMPORTANT
let theta = Math.PI / 4; // Initialize to some angle
let phi = Math.PI / 4; // Initialize to some angle
let radius = 10; // The distance from the player to the camera


//Making sure mouse doesn't go off screen
let mouseIsDown = false;
let isLeftButtonPressed = false;
let isRightButtonPressed = false;

// Initially set to false
document.addEventListener('mousedown', () => {
    mouseIsDown = true;
});

document.addEventListener('mouseup', () => {
    mouseIsDown = false;
});


// Listen for right mouse button down
document.addEventListener('mousedown', function (event) {
    // Left button
    if (event.button === 0) {
        isLeftButtonPressed = true;
        document.body.style.cursor = 'none';  // Hide cursor
    }
    // Right button
    else if (event.button === 2) {  // Right button
        isRightButtonPressed = true;
        document.body.style.cursor = 'none';  // Hide cursor
        event.preventDefault();  // Prevent context menu
    }
}, false);

// Listen for right mouse button up
document.addEventListener('mouseup', function (event) {
    // Left button
    if (event.button === 0) {
        isLeftButtonPressed = false;
        document.body.style.cursor = 'auto';  // Show cursor
    }
    //Right Button
    else if (event.button === 2) {  // Right button
        isRightButtonPressed = false;
        document.body.style.cursor = 'auto';  // Show cursor
    }
}, false);

// Prevent context menu from showing up on right click
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
}, false);

//
//TO LOCK MOUSE ON SCREEN CODE BELOW
//

// Function to request a pointer lock
function requestPointerLock() {
    document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
    document.body.requestPointerLock();
}

// Function to exit a pointer lock
function exitPointerLock() {
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
    document.exitPointerLock();
}

// Updated mousedown event listener
document.addEventListener('mousedown', function (event) {
    if (event.button === 0) {  // Left button
        isLeftButtonPressed = true;
        document.body.style.cursor = 'none';
        requestPointerLock();  // Lock the pointer
    }
    else if (event.button === 2) {  // Right button
        isRightButtonPressed = true;
        document.body.style.cursor = 'none';
        requestPointerLock();  // Lock the pointer
        event.preventDefault();
    }
}, false);

// Updated mouseup event listener
document.addEventListener('mouseup', function (event) {
    if (event.button === 0) {  // Left button
        isLeftButtonPressed = false;
        document.body.style.cursor = 'auto';
        exitPointerLock();  // Release the pointer lock
    }
    else if (event.button === 2) {  // Right button
        isRightButtonPressed = false;
        document.body.style.cursor = 'auto';
        exitPointerLock();  // Release the pointer lock
    }
}, false);

document.addEventListener('mousemove', function (event) {
    if (mouseIsDown) {
        // Update theta and phi based on mouse movement
        theta += event.movementX * 0.01;
        phi -= event.movementY * 0.01;

        // Clamp phi to be between a certain range to prevent ground clipping
        phi = Math.max(0.1, Math.min(Math.PI - 2, phi)); // Adjust Math.PI - 0.5 to your needs
    }
});

document.addEventListener('wheel', function (event) {
    // Update radius based on scroll
    radius -= event.deltaY * -0.1;

    // Clamp radius
    radius = Math.max(5, Math.min(50, radius));
});

// Listen for mouse move
document.addEventListener('mousemove', function (event) {
    if (isRightButtonPressed) {
        // Update player direction here based on mouse movement
        // You can use event.movementX and event.movementY to get the mouse delta
        player.rotation.y -= event.movementX * 0.01;  // Adjust the multiplier as needed
    }
}, false);



//TEMPEORARY CHARACTER SETTINGS PAGE
onst acceleration = 0.1;  // adjust as per your requirement

function updateControls() {


    // If you want the camera to follow the player
    if (player) {

        const speed = 0.1;  // replace with your actual speed
        let moveDirection = new THREE.Vector3();

        // Initialize moveDirection based on pressed keys
        if (keyState.w) {
            moveDirection.z = 1;  // Moving forward
        }
        if (keyState.d) {
            moveDirection.x = -1;  // Moving left
        }
        if (keyState.s) {
            moveDirection.z = -1;  // Moving backward
        }
        if (keyState.a) {
            moveDirection.x = 1;  // Moving right
        }

        // Normalize the vector to ensure consistent speed in all directions
        moveDirection.normalize();

        // Rotate moveDirection by player's current rotation
        moveDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation.y);

        // Update player position
        player.position.addScaledVector(moveDirection, speed);

        // Update player velocity
        player.velocity = moveDirection.clone().multiplyScalar(speed);

        // Calculate the camera's position using spherical coordinates
        const x = player.position.x + radius * Math.sin(phi) * Math.cos(theta);
        const y = player.position.y + radius * Math.cos(phi);
        const z = player.position.z + radius * Math.sin(phi) * Math.sin(theta);

        // Update the camera position
        camera.position.set(x, y, z);
        camera.lookAt(player.position);


        handleActions(keyState);
    }
}

export { initControls, updateControls };