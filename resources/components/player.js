import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { scene } from './scene.js';  // Adjust the import to match your project structure

export let player;  // This will store our loaded player model
let playerAnimations = {};  // We will store the animations here


function initPlayer() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        console.log('Initializing player');

        loader.load('models/athleteModels/Man.glb', (gltf) => {
            player = gltf.scene;
            scene.add(player);

            // Store the animations
            gltf.animations.forEach((clip) => {
                playerAnimations[clip.name] = clip;
            });

            // Play the idle animation by default
            const mixer = new THREE.AnimationMixer(player);
            const action = mixer.clipAction(playerAnimations["HumanArmature|Man_Idle"]);
            action.play();

            // Initialize velocity and position
            player.velocity = new THREE.Vector3(0, 0, 0);
            player.position.set(62, .4, -118.15);
            player.scale.set(1, 1, 1);

            resolve();  // Resolve the promise since the model has loaded
        },
            undefined,
            (error) => {
                console.error('An error occurred while loading the model');
                reject(error);  // Reject the promise if there's an error
            });
    });
}

function updatePlayer() {
    // This function will later be filled with code to update the player's position and animations based on user input
}

export { initPlayer, updatePlayer };