import * as THREE from 'three';
import { player } from './player.js';  // Import your player object
import { ball, ballVelocity } from './ball.js';
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

    const attractionStrength = 100;
    const distance = checkDistance(player.position, ball.position);

    if (distance < distanceThreshold) {
        const offset = new THREE.Vector3(0, .86, -0.5);
        const targetPosition = player.position.clone().add(offset);

        // Calculate the attraction force vector in Cannon.js format
        const attractionForce = new CANNON.Vec3(
            targetPosition.x - ball.position.x,
            targetPosition.y - ball.position.y,
            targetPosition.z - ball.position.z
        );

        attractionForce.normalize();  // Normalizes the vector in place


        // Manually scale the force vector by the attraction strength
        attractionForce.x *= attractionStrength;
        attractionForce.y *= attractionStrength;
        attractionForce.z *= attractionStrength;

        // Apply the force to the ball's physics body
        ballBody.applyForce(attractionForce, ballBody.position);

        console.log("Attraction Force:", attractionForce);
    }
}

export function updateBallPosition() {
    if (!ball || !ball.position) {
        console.error('Ball or ball.position is undefined');
        return;
    }
    const maxSpeed = 5;
    if (ballVelocity.length() > maxSpeed) {
        ballVelocity.normalize().multiplyScalar(maxSpeed);
    }

    ball.position.add(ballVelocity);
    ballVelocity.multiplyScalar(0.9);
    ball.updateMatrix();
    //console.log("Ball Position:", ball.position);
}

function checkDistance(posA, posB) {
    return posA.distanceTo(posB);
}


