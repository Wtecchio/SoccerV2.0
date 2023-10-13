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

    const attractionStrength = 60;
    const dampingStrength = 9999999;
    const distance = checkDistance(player.position, ball.position);
    const minVelocity = 0.1; // Added this line

    if (distance < distanceThreshold) {
        const playerDirection = player.velocity.clone().normalize();
        const offset = playerDirection.clone().multiplyScalar(0.8);
        offset.setY(0.1);


        const targetPosition = player.position.clone().add(offset);

        // Calculate the attraction force vector in Cannon.js format
        let attractionForce = new CANNON.Vec3(
            targetPosition.x - ball.position.x,
            targetPosition.y - ball.position.y,
            targetPosition.z - ball.position.z
        );

        const speed = ballBody.velocity.length();


        // Reset the flag as the ball is not stopped.
        ballStopped = false;

        if (speed > 0.5 && distance < (distanceThreshold * 0.1)) {
            // Calculate the component of the ball's velocity that is perpendicular to the player's velocity
            const parallelComponent = ballBody.velocity.dot(playerDirection);
            const parallelVelocity = playerDirection.clone().scale(parallelComponent);
            const perpendicularVelocity = ballBody.velocity.clone().vsub(parallelVelocity);

            // Apply a damping force only in the perpendicular direction
            const dampingForce = perpendicularVelocity.scale(-1 * dampingStrength);
            attractionForce.vadd(dampingForce, attractionForce);
        }


        if (attractionForce) {
            console.log("Attraction Force:", JSON.stringify(attractionForce));
        }
        if (player && player.velocity) {
            console.log("Player Velocity:", JSON.stringify(player.velocity));

        }
        if (ballBody && ballBody.velocity) {
            console.log("Ball Velocity:", JSON.stringify(ballBody.velocity));
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

