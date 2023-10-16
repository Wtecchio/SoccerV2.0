import * as THREE from 'three';
import { player } from './player.js';  // Import your player object
import { ball } from './ball.js';


export const PlayerStates = {
    IDLE: 'idle',
    RUNNING: 'running',
    DRIBBLING: 'dribbling',
    KICKING: 'kicking',
    SPRINTING: 'sprinting',
    WALKING_BACKWARD: 'walking_backward',
    SLIDING: 'sliding'
    // ... any other states you need
};

let currentState = PlayerStates.IDLE;
let hasBall = false;
let slideTriggered = false;  // New variable to track if slide has been triggered

let slidingCounter = 0;  // Add this counter outside the function

export function updatePlayerState(isSlideTriggered = false) {
    //console.log("Before updatePlayerState:", currentState); // Debug line
    slideTriggered = isSlideTriggered;

    if (!player || !ball) return;

    // If the sliding counter is active, decrement it
    if (slidingCounter > 0) {
        slidingCounter--;
        return;  // Do not update the state while sliding
    }

    // Check if slide has been triggered
    if (slideTriggered) {
        currentState = PlayerStates.SLIDING;
        slideTriggered = false;
        slidingCounter = 54;  // Set the counter to 54 frames

        // Check for interaction with the ball while sliding
        const distanceToBall = player.position.distanceTo(ball.position);
        if (distanceToBall < 1.3) {  // Replace with your actual collision detection logic
            // Logic to apply force to the ball
            ball.applySlideForce(player);  // Assuming you have an applySlideForce method in ball.js
        }


        return;
    }

    // Example logic to update state based on player's velocity
    if (player.velocity.length() > 0) {  // Replace with your actual logic
        currentState = PlayerStates.RUNNING;
    } else {
        currentState = PlayerStates.IDLE;
    }

    // Walk animation for going backward
    if (player.velocity.length() > 0) {
        // Get the forward vector of the player
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(player.quaternion);

        // Calculate the angle between forward vector and velocity
        const angle = forward.angleTo(player.velocity) * (180 / Math.PI);

        // Decide the state based on the angle
        if (angle > 90) {
            currentState = PlayerStates.RUNNING;
        } else {
            currentState = PlayerStates.WALKING_BACKWARD;
        }
    } else {
        currentState = PlayerStates.IDLE;
    }

    // Example logic to update 'hasBall' based on distance to ball
    const distance = player.position.distanceTo(ball.position);  // Replace with your actual logic
    if (distance < 1.3) {
        hasBall = true;
    } else {
        hasBall = false;
    }

    //console.log("After updatePlayerState:", currentState); // Debug line
}

export function getPlayerState() {
    return currentState;
}

export function getHasBall() {
    return hasBall;
}