import * as THREE from 'three';
import { player } from './player.js';  // Import your player object
import { ball } from './ball.js';
import { ballBody } from './physics.js';
import * as CANNON from 'cannon'

let lastAttractionForce = new CANNON.Vec3(0, 0, 0);  // Initialize outside the function
const lerpFactor = 0.2;  // The amount to interpolate between the last and current force

export function applyMagneticEffect() {
    if (!player || !ball || !ballBody) return;

    const baseAttractionStrength = 300;
    const stoppingDistance = 0.2;
    const distanceThreshold = 1.5;
    const speedMultiplier = 5;
    const dampingStrength = 500;
    const maxBallVelocity = 10;  // The maximum speed the ball can have when close to the player.

    const distance = checkDistance(player.position, ball.position);
    const playerSpeed = player.velocity.length();

    if (distance < distanceThreshold) {
        const distanceFactor = Math.min(1, distance / distanceThreshold);

        if (playerSpeed < 0.01) {
            ballBody.velocity.scale(distanceFactor);
            ballBody.angularVelocity.set(0, 0, 0);
        } else {
            const dynamicAttractionStrength = baseAttractionStrength * (1 + speedMultiplier * playerSpeed);

            const forward = new THREE.Vector3(0, 0, 1);
            forward.applyEuler(player.rotation);

            const offsetDistance = 1.1;
            const offsetPosition = forward.clone().multiplyScalar(offsetDistance);
            const targetPosition = player.position.clone().add(offsetPosition);

            let attractionForce = new CANNON.Vec3(
                targetPosition.x - ball.position.x,
                targetPosition.y - ball.position.y,
                targetPosition.z - ball.position.z
            );

            attractionForce.normalize();
            attractionForce.scale(dynamicAttractionStrength * distanceFactor, attractionForce);

            if (distance < stoppingDistance) {
                const dampingForce = ballBody.velocity.clone().scale(-dampingStrength * distanceFactor);
                ballBody.applyForce(dampingForce, ballBody.position);
            } else {
                ballBody.applyForce(attractionForce, ballBody.position);
            }
        }

        // Clamp the velocity if it exceeds maximum allowed velocity
        if (ballBody.velocity.length() > maxBallVelocity) {
            ballBody.velocity.normalize();
            ballBody.velocity.scale(maxBallVelocity, ballBody.velocity);
        }

        ballBody.wakeUp();
    }
}







function checkDistance(posA, posB) {
    return posA.distanceTo(posB);
}

