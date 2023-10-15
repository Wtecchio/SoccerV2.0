import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { scene } from './scene.js';
import { getPlayerState, PlayerStates } from './playerState.js';

export let player;
export let mixer;
let idleAction, runAction, walkAction, slideAction;


// Initialize the player
function initPlayer() {
    return new Promise((resolve, reject) => {
        const fbxLoader = new FBXLoader();
        console.log('Initializing player');

        // Load the new FBX player model
        fbxLoader.load('models/athleteModels/newMan.fbx', (fbx) => {
            console.log("FBX Loaded:", fbx);  // Debug line

            player = fbx;

            // Scale the player
            const scaleValue = 1;  // Replace with the scale you want
            player.scale.set(scaleValue, scaleValue, scaleValue);


            scene.add(player);


            // Initialize the animation mixer
            mixer = new THREE.AnimationMixer(player);

            // Load all animations
            const animationFiles = ['Backwards.fbx', 'Idle.fbx', 'Running.fbx', 'Soccer_Tackle.fbx'];
            const animationActions = [];

            animationFiles.forEach((file, index) => {
                fbxLoader.load(`models/athleteModels/animations/${file}`, (animFbx) => {
                    const clip = animFbx.animations[0];
                    removeTranslationFromAnimation(clip);
                    const action = mixer.clipAction(clip);
                    animationActions.push(action);

                    if (index === animationFiles.length - 1) {
                        [walkAction, idleAction, runAction, slideAction] = animationActions;

                        // Setting default action to idle
                        idleAction.play();

                        // Initialize player attributes
                        player.velocity = new THREE.Vector3(0, 0, 0);
                        player.position.set(62, .4, -118.15);
                        player.scale.set(1, 1, 1);


                        resolve();
                    }
                }, undefined, reject);
            });
        }, undefined, reject);
    });
}

//
//UPDATE PLAYER FUNCTION
//
let lastState = null;
let allowStateUpdate = true;
let isSliding = false; // Add this flag outside the function to track the sliding state


let slidingStartTime = null;
let originalY = null;

function updatePlayer() {
    if (!allowStateUpdate) return;

    const currentState = getPlayerState();

    if (currentState !== lastState) {
        // Stop all actions first
        idleAction.stop();
        runAction.stop();
        walkAction.stop();
        slideAction.stop();

        // Reset timeScale for all actions
        idleAction.timeScale = 1;
        runAction.timeScale = 1;
        walkAction.timeScale = -1;
        slideAction.timeScale = 1;

        // Play the appropriate action based on the current state
        if (currentState === PlayerStates.RUNNING) {
            runAction.play();
        } else if (currentState === PlayerStates.WALKING_BACKWARD) {
            walkAction.timeScale = 1;
            walkAction.play();
        } else if (currentState === PlayerStates.SLIDING) {
            slideAction.play();

            // Lower the player for sliding action
            if (!isSliding) {
                player.position.y -= 1.6;  // Replace 1.0 with your actual offset value
                isSliding = true;
            }

            // Disable state updates for the duration of the slide animation
            allowStateUpdate = false;
            setTimeout(() => {
                // Reset the player's position after sliding
                if (isSliding) {
                    player.position.y += 1.6;  // Replace 1.0 with your actual offset value
                    isSliding = false;
                }
                allowStateUpdate = true;
            }, slideAction._clip.duration * 1000);
        } else {
            idleAction.play();
        }
        lastState = currentState;
    }
}


function removeTranslationFromAnimation(clip) {
    clip.tracks = clip.tracks.filter(track => {
        return !/\.position/.test(track.name);
    });
}

export { initPlayer, updatePlayer };