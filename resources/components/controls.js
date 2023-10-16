import * as THREE from 'three';
import { camera, renderer } from './scene.js';
import { OrbitControls } from '../jsLib/OrbitControls.js';  // Adjust the path if needed
import { player, isSliding } from './player.js';  // Import your player object
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
    ' ':false
};

let wKeyReleasedAfterSlide = true; // Initialize to true to allow running immediately

// Listen for keydown events
document.addEventListener('keydown', function (event) {
    switch (event.code) {
        case 'KeyW':
            if (!isSliding && wKeyReleasedAfterSlide) {
                keyState.w = true;
            }
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
        case 'KeyQ':
            keyState.q = true;
            break;
        case 'KeyE':
            keyState.e = true;
            break;
    }
});

// Listen for keyup events
document.addEventListener('keyup', function (event) {
    switch (event.code) {
        case 'KeyW':
            keyState.w = false;
            if (isSliding) {
                wKeyReleasedAfterSlide = true;
            }
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
        case 'KeyQ':
            keyState.q = false;  // Note: Changed to false
            break;
        case 'KeyE':
            keyState.e = false;  // Note: Changed to false
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
    if (isRightButtonPressed && !isSliding) {  // Added !isSliding condition here
        // Update player direction here based on mouse movement
        // You can use event.movementX and event.movementY to get the mouse delta
        player.rotation.y -= event.movementX * 0.01;  // Adjust the multiplier as needed
    }
}, false);



//VARIABLES FOR SPHERE AROUND PLAYER AND CAMERA CLAMPS SUPER IMPORTANT
let theta = Math.PI / 4; // Initialize to some angle
let phi = Math.PI / 4; // Initialize to some angle
let radius = 10; // The distance from the player to the camera

let currentSpeed = 0;  // Store the current speed of the player
const maxSpeed = 0.11;  // Maximumd speed of the player
const acceleration = 0.008;  // Acceleration rate
const deceleration = 0.01;  // Deceleration rate
const turnSpeed = 0.007;  // Turn speed for changing direction
const directionLerpFactor = 0.1;  // Factor for interpolating direction changes

const forwardSpeed = maxSpeed;  // Maximum speed when moving forward
const backwardSpeed = maxSpeed * 0.4;  // Maximum speed when moving backward
const lateralSpeed = maxSpeed * 0.6;  // Maximum speed when moving laterally

let slidingDeceleration = 1
const slidingSpeedBoost = 3; // Add this to your constants; adjust as needed
let currentDirection = new THREE.Vector3();  // Current movement direction
let desiredDirection = new THREE.Vector3();  // Desired movement direction based on key presses

//Private bariablesw
class Player {
    constructor() {
        this._isSliding = false; // private variable
    }

    get isSliding() {
        return this._isSliding;
    }

    set isSliding(value) {
        this._isSliding = value;
    }
}


function updateControls() {
    if (player) {
        // If sliding, restrict movement to forward only
        if (isSliding) {
            desiredDirection.set(0, 0, 1);
            currentSpeed -= slidingDeceleration;  // apply some deceleration during slide
            if (currentSpeed < 0) currentSpeed = 0;
        } else {
            // Reset desiredDirection
            desiredDirection.set(0, 0, 0);

            // Determine the desired direction based on pressed keys
            if (keyState.w && wKeyReleasedAfterSlide) {
                desiredDirection.z = 1;
            }
            if (keyState.s) desiredDirection.z = -1;
            if (keyState.q) desiredDirection.x = 1;
            if (keyState.e) desiredDirection.x = -1;
        }

        desiredDirection.normalize();

        // Apply different speed limits based on movement direction
        let speedLimit = maxSpeed;
        if (desiredDirection.z > 0) speedLimit = forwardSpeed;
        if (desiredDirection.z < 0) speedLimit = backwardSpeed;
        if (desiredDirection.x !== 0) speedLimit = lateralSpeed;

        // Reset the lerp when changing direction or coming to a stop
        if ((currentDirection.dot(desiredDirection) < 0 && currentSpeed < 0.1) || (!keyState.w && !keyState.q && !keyState.s && !keyState.e)) {
            currentDirection.copy(desiredDirection);
        }

        // Smoothly interpolate from the current direction to the desired direction
        currentDirection.lerp(desiredDirection, directionLerpFactor);

        // Update the player's current speed based on whether a move key is pressed
        if (keyState.w || keyState.q || keyState.s || keyState.e) {
            currentSpeed += acceleration;
            if (currentSpeed > speedLimit) currentSpeed = speedLimit;  // Use speedLimit instead of maxSpeed
        } else {
            currentSpeed -= deceleration;
            if (currentSpeed < 0) currentSpeed = 0;
        }

        // Multiply by the player's current speed to get the movement vector
        let moveDirection = currentDirection.clone().multiplyScalar(currentSpeed);

        // Rotate moveDirection by player's current rotation
        moveDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation.y);

        // Turning the player
        if (keyState.a) player.rotation.y += turnSpeed;  // Turn left
        if (keyState.d) player.rotation.y -= turnSpeed;  // Turn right

        // Update player position
        player.position.addScaledVector(moveDirection, 1);

        // Update player velocity for other uses (e.g., interaction with ball)
        player.velocity = moveDirection;


        // Turning the player also turns the camera
        if (keyState.a) {
            player.rotation.y += turnSpeed;  // Turn left
            theta -= turnSpeed * 2;  // Rotate camera
        }
        if (keyState.d) {
            player.rotation.y -= turnSpeed;  // Turn right
            theta += turnSpeed * 2;  // Rotate camera
        }


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