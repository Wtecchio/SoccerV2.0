import * as THREE from 'three';
import { player } from './player.js';  // Import your player object
import { ball } from './ball.js';


export const PlayerStates = {
    IDLE: 'idle',
    RUNNING: 'running',
    DRIBBLING: 'dribbling',
    KICKING: 'kicking',
    SPRINTING: 'sprinting',
    WALKING_BACKWARD: 'walking_backward'
    // ... any other states you need
};

let currentState = PlayerStates.IDLE;
let hasBall = false;

export function updatePlayerState() {


    if (!player || !ball) return;

    // Example logic to update state based on player's velocity
    if (player.velocity.length() > 0) {  // Replace with your actual logic
        currentState = PlayerStates.RUNNING;
    } else {
        currentState = PlayerStates.IDLE;
    }

    //walk animation for going backwards
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
    if (distance < 1.1) {
        hasBall = true;
    } else {
        hasBall = false;
    }

    //console.log("Current State:", currentState);
    //console.log("Has Ball:", hasBall);


}

export function getPlayerState() {
    return currentState;
}

export function getHasBall() {
    return hasBall;
}