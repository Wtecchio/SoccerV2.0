import * as THREE from 'three';
import { player } from './player.js';  // Import your player object
import { ball } from './ball.js';
import { ballBody } from './physics.js';
import * as CANNON from 'cannon'

export function applyMagneticEffect() {
    if (!player || !ball || !ballBody) return;

    const baseAttractionStrength = 300;
    const stoppingDistance = 0.2;
    const distanceThreshold = 1.5;
    const speedMultiplier = 5;
    const dampingStrength = 500;

    const distance = checkDistance(player.position, ball.position);
    const playerSpeed = player.velocity.length();

    if (distance < distanceThreshold) {
        const distanceFactor = Math.min(1, distance / distanceThreshold);

        if (playerSpeed < 0.01) {
            ballBody.velocity.scale(distanceFactor);
            ballBody.angularVelocity.set(0, 0, 0);
        } else {
            const dynamicAttractionStrength = baseAttractionStrength * (1 + speedMultiplier * playerSpeed);

            // Calculate the offset position in front of the player
            const forward = new THREE.Vector3(0, 0, 1);
            forward.applyEuler(player.rotation);

            const offsetDistance = 1.1;
            const offsetPosition = forward.clone().multiplyScalar(offsetDistance);

            // Adjust target position to be in front of the player
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

        ballBody.wakeUp();
    }
}









function checkDistance(posA, posB) {
    return posA.distanceTo(posB);
}

