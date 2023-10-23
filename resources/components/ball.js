import * as THREE from 'three';
import { scene } from './scene.js'; // If you're adding the ball directly to the main scene
import { loadAssets, footballTextures } from './assets.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

let ball;  // This will store the loaded ball model


//Load textures onto ball
async function createBall() {
    // Await the loading of assets before proceeding
    await loadAssets();

    const loader = new FBXLoader();
    loader.load('models/source/footballLp.fbx', (model) => {
        model.traverse((child) => {
            if (child.isMesh) {
                child.material.map = footballTextures.baseColor;
                child.material.normalMap = footballTextures.normal;
                child.material.aoMap = footballTextures.mixedAO;
                child.material.roughnessMap = footballTextures.roughness;
            }
        });

        ball = model;
        ball.position.set(59, 5, -118.15);
        ball.velocity = new THREE.Vector3(0, 0, 0); // Initialize velocity
        ball.scale.set(.008, .008, .008);

        // Add applyForce method to ball
        ball.applyForce = function (force) {
            const ballMass = 1;
            const acceleration = force.divideScalar(ballMass);
            ball.velocity.add(acceleration);;
        };

        scene.add(ball);
        console.log('Ball after creation:', ball);
    });
}


// Inside ball.js
export function applySlideForce(player) {
    console.log("Applying slide force");
    console.log("Player velocity: ", player.velocity);

    // Your existing code
    const slideForce = player.velocity.clone().multiplyScalar(2);
    ball.applyForce(slideForce);
}

export { createBall, ball };