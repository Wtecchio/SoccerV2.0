import * as THREE from 'three';
import { GLTFLoader } from '../jsLib/GLTFLoader.js';

let player;  // This will store our loaded player model
let playerAnimations = {};  // We will store the animations here

function initPlayer() {
    const loader = new GLTFLoader();
    loader.load('../models/athleteModels/Man.glb', (gltf) => {
        player = gltf.scene;
        scene.add(player);

        // Store the animations
        gltf.animations.forEach((clip) => {
            playerAnimations[clip.name] = clip;
        });

        // For now, we'll just play the idle animation by default
        const mixer = new THREE.AnimationMixer(player);
        const action = mixer.clipAction(playerAnimations["Idle"]);  // Assuming there's an animation named "Idle"
        action.play();

        // Position the player in the world (adjust as needed)
        player.position.set(0, 0, 0);
    });
}

function updatePlayer() {
    // This function will later be filled with code to update the player's position and animations based on user input
}

export { initPlayer, updatePlayer };