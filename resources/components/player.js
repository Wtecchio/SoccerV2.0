import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { scene } from './scene.js';  // Adjust the import to match your project structure
import { getPlayerState, PlayerStates } from './playerState.js';  // import getPlayerState and PlayerStates

export let player;  // This will store our loaded player model
export let mixer;  // Declare it as exportable
let playerAnimations = {};  // We will store the animations here
let idleAction, runAction, walkAction;  // Declare these at the top of your file



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

            gltf.animations.forEach((clip) => {
                console.log("Loaded clip:", clip.name);
                playerAnimations[clip.name] = clip;
            });

            // Play the idle animation by default
            mixer = new THREE.AnimationMixer(player);//important
        

            // Set up idle animation
            idleAction = mixer.clipAction(playerAnimations["HumanArmature|Man_Idle"]);
            idleAction.play();

            // Assuming you have the run and walk animations named as "HumanArmature|Man_Run" and "HumanArmature|Man_Walk"
            // Set up run animation
            runAction = mixer.clipAction(playerAnimations["HumanArmature|Man_Run"]);

            // Set up walk animation
            walkAction = mixer.clipAction(playerAnimations["HumanArmature|Man_Walk"]);


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
    const currentState = getPlayerState();

    if (currentState === PlayerStates.RUNNING) {
        idleAction.stop();
        runAction.play();
    } else {
        runAction.stop();
        idleAction.play();
    }
    
}

export { initPlayer, updatePlayer };