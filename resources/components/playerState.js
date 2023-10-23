import * as THREE from 'three';
import { player } from './player.js';  // Import your player object
import { ball, applySlideForce } from './ball.js';
import { scene } from './scene.js';



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

//DEBUG DELETE ALL SOON
// Green sphere to indicate "has ball" distance
let hasBallDebugMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })  // Green
);
scene.add(hasBallDebugMesh);


// Create a green sphere for indicating slide force
const slideForceGeometry = new THREE.SphereGeometry(1, 32, 32);
const slideForceMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const slideForceDebugMesh = new THREE.Mesh(slideForceGeometry, slideForceMaterial);
slideForceDebugMesh.visible = false; // Initially set to invisible
scene.add(slideForceDebugMesh);


// Red sphere to indicate contact point
let contactDebugMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })  // Red
);
scene.add(contactDebugMesh);
////


export function updatePlayerState(isSlideTriggered = false) {
    // Initialize variables
    if (!player || !ball) return;

    // Define collisionPoint based on player's position
    const collisionPoint = new THREE.Vector3().copy(player.position);

    // Update slideTriggered
    slideTriggered = isSlideTriggered;

    // If slidingCounter is active, decrement it
    if (slidingCounter > 0) {
        // Offset collisionPoint when sliding
        collisionPoint.y += 1.3;

        //DEBUG DELETE LATER
        // Make slideForceDebugMesh visible and update its position
        slideForceDebugMesh.visible = true;
        slideForceDebugMesh.position.copy(collisionPoint);

        /////////

        // Decrement slidingCounter
        slidingCounter--;

        // Do not update the state while sliding
        return;
    }

    // Check if slide has been triggered
    if (slideTriggered) {
        // Update player state to SLIDING
        currentState = PlayerStates.SLIDING;

        // Apply slide force to the ball
        applySlideForce(player);

        // Reset slideTriggered
        slideTriggered = false;

        // Initialize slidingCounter
        slidingCounter = 280;

        // Calculate distance from player to ball
        const distance = collisionPoint.distanceTo(ball.position);

        // Update hasBall based on distance
        hasBall = distance < 1.3;


        return;
    }

    // Calculate distance from player to ball
    const distance = player.position.distanceTo(ball.position);

    // Update hasBall based on distance
    hasBall = distance < 1.3;

    //DEBUG VISUAL DELETE SOON
    // Scale the hasBallDebugMesh to match the "zone"
    const zoneRadius = 1.6;  // This is your defined distance for ball contact
    hasBallDebugMesh.scale.set(zoneRadius, zoneRadius, zoneRadius);


    // Update hasBallDebugMesh position and color
    hasBallDebugMesh.position.copy(player.position);
    hasBallDebugMesh.material.color.set(hasBall ? 0xff0000 : 0x0000ff);  // Red if hasBall, otherwise blue
        //

    // Update currentState based on player's velocity
    if (player.velocity.length() > 0) {
        // Determine forward vector of player
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(player.quaternion);

        // Calculate angle between forward vector and velocity
        const angle = forward.angleTo(player.velocity) * (180 / Math.PI);

        // Update currentState based on angle
        currentState = angle > 90 ? PlayerStates.RUNNING : PlayerStates.WALKING_BACKWARD;
    } else {

        //DEBUG DELETE LATER
        // Make slideForceDebugMesh invisible when not sliding
        slideForceDebugMesh.visible = false;
        ////////
        currentState = PlayerStates.IDLE;
    }
}

export function getPlayerState() {
    return currentState;
}

export function getHasBall() {
    return hasBall;
}