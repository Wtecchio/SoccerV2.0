import * as THREE from 'three';
import { player } from './player.js';  // Import your player object
import { ball } from './ball.js';
import { ballBody } from './physics.js';
import * as CANNON from 'cannon'



export function applyMagneticEffect() {
    if (!player || !ball || !ballBody) return;

    const baseAttractionStrength = 300;
    const stoppingDistance = 0.02;
    const distanceThreshold = 1.5;
    const speedMultiplier = 5;
    const dampingStrength = 1000;

    const distance = checkDistance(player.position, ball.position);
    const playerSpeed = player.velocity.length();

    if (distance < distanceThreshold) {
        if (playerSpeed < 0.01) {
            // If player is almost stationary, lock the ball in place
            ballBody.velocity.set(0, 0, 0);
            ballBody.angularVelocity.set(0, 0, 0); // Optionally stop the ball from rotating as well
        } else {
            // If player is moving, apply attraction force
            const dynamicAttractionStrength = baseAttractionStrength * (1 + speedMultiplier * playerSpeed);

            // Calculate the offset position in front of the player
            const playerDirection = player.velocity.clone().normalize();
            const offsetDistance = 1.1;  // Set this to how far in front of the player you want the ball
            const offsetPosition = playerDirection.clone().multiplyScalar(offsetDistance);

            // Adjust target position to be in front of the player
            const targetPosition = player.position.clone().add(offsetPosition);;

            let attractionForce = new CANNON.Vec3(
                targetPosition.x - ball.position.x,
                targetPosition.y - ball.position.y,
                targetPosition.z - ball.position.z
            );

            attractionForce.normalize();
            attractionForce.scale(dynamicAttractionStrength, attractionForce);

            if (distance < stoppingDistance) {
                // Apply strong damping
                const dampingForce = ballBody.velocity.clone().scale(-dampingStrength);
                ballBody.applyForce(dampingForce, ballBody.position);
            } else {
                // Apply attraction force
                ballBody.applyForce(attractionForce, ballBody.position);
            }
        }

        ballBody.wakeUp();
    }
}









function checkDistance(posA, posB) {
    return posA.distanceTo(posB);
}

