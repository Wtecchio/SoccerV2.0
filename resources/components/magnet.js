import * as THREE from 'three';
import { player } from './player.js';  // Import your player object
import { ball } from './ball.js';
import { ballBody } from './physics.js';
import * as CANNON from 'cannon'


// Define a distance threshold for the magnetic effect
const distanceThreshold = 1.0;  // Adjust this value as needed

/*
// Function to check the distance between two 3D points
export function checkDistance(playerPosition, ballPosition) {
    const distanceVector = new THREE.Vector3().subVectors(playerPosition, ballPosition);
    const distance = distanceVector.length();
    return distance;
}

*/

export function applyMagneticEffect() {
    if (!player || !ball || !ballBody) return;  // Ensure all objects are available

    const attractionStrength = 1200;
    const dampingStrength = 9999999;
    const distance = checkDistance(player.position, ball.position);

    if (distance < distanceThreshold) {
        const offset = new THREE.Vector3(0, .1, .75);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation.y);

        const targetPosition = player.position.clone().add(offset);

        // Calculate the attraction force vector in Cannon.js format
        let attractionForce = new CANNON.Vec3(
            targetPosition.x - ball.position.x,
            targetPosition.y - ball.position.y,
            targetPosition.z - ball.position.z
        );

        const speed = ballBody.velocity.length();
        if (speed > 0.5 && distance < (distanceThreshold * 0.1)) {
            // Apply a damping force when close to the player to reduce the whirlpool effect
            const dampingForce = ballBody.velocity.clone().scale(-1 * dampingStrength);
            attractionForce.vadd(dampingForce, attractionForce);
        }

        // Normalize and scale the attraction force
        attractionForce.normalize();
        attractionForce.scale(attractionStrength, attractionForce);

        // Apply the force to the ball's physics body
        ballBody.applyForce(attractionForce, ballBody.position);
    }
}


function checkDistance(posA, posB) {
    return posA.distanceTo(posB);
}


