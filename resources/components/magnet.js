import * as THREE from 'three';
import { player } from './player.js';  // Import your player object
import { ball } from './ball.js';
import { ballBody } from './physics.js';
import * as CANNON from 'cannon'


// Define a distance threshold for the magnetic effect
const distanceThreshold = 1.0;  // Adjust this value as needed
let ballStopped = false;  // Add this state flag at an appropriate scope level



export function applyMagneticEffect() {
    if (!player || !ball || !ballBody) return;  // Ensure all objects are available

    const distance = checkDistance(player.position, ball.position);

    // Use a constant attraction strength for testing
    const attractionStrength = 150;

    // Velocity thresholds for 'resting' state
    const minPlayerSpeed = 0.1;
    const minBallSpeed = .14;

    if (distance < distanceThreshold) {
        if (player.velocity.length() < minPlayerSpeed && ballBody.velocity.length() < minBallSpeed) {
            // If both the player and the ball are nearly at rest, stop the ball
            ballBody.velocity.set(0, 0, 0);
        } else {
            // Directly set the target position to the player's position for testing
            const targetPosition = player.position.clone();

            // Calculate the attraction force vector in Cannon.js format
            let attractionForce = new CANNON.Vec3(
                targetPosition.x - ball.position.x,
                targetPosition.y - ball.position.y,
                targetPosition.z - ball.position.z
            );

            // Normalize and scale the attraction force
            attractionForce.normalize();
            attractionForce.scale(attractionStrength, attractionForce);

            // Apply the force to the ball's physics body
            ballBody.applyForce(attractionForce, ballBody.position);
        }
    }
}


function checkDistance(posA, posB) {
    return posA.distanceTo(posB);
}

