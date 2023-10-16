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

        // Load the new FBX Droid model
        fbxLoader.load('models/athleteModels/Droid/BattleDroid.fbx', (fbx) => {
            console.log("FBX Loaded:", fbx);

            player = fbx;
            const scaleValue = 1;
            player.scale.set(scaleValue, scaleValue, scaleValue);
            scene.add(player);

            // Initialize the animation mixer
            mixer = new THREE.AnimationMixer(player);

            // Load all animations
            const animationFiles = ['Backwards.fbx', 'Idle.fbx', 'Running.fbx', 'Soccer_Tackle.fbx'];
            const animationActions = [];

            animationFiles.forEach((file, index) => {
                fbxLoader.load(`models/athleteModels/Droid/animations/${file}`, (animFbx) => {
                    const clip = animFbx.animations[0];

                    // Remove translation from all animations
                    removeTranslationFromAnimation(clip);

                    const action = mixer.clipAction(clip);
                    animationActions.push(action);

                    if (index === animationFiles.length - 1) {
                        [walkAction, idleAction, runAction, slideAction] = animationActions;
                        idleAction.play();
                        player.velocity = new THREE.Vector3(0, 0, 0);
                        player.position.set(62, .3, -118.15);
                        player.scale.set(2, 2, 2);
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
let targetY; // Declare this at the top of your script where you declare other variables like isSliding


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
        runAction.timeScale = 1.2;
        walkAction.timeScale = -1;
        slideAction.timeScale = 1;

        switch (currentState) {
            case PlayerStates.RUNNING:
                runAction.play();  // Corrected here
                break;
            case PlayerStates.WALKING_BACKWARD:
                walkAction.timeScale = 1;
                walkAction.play();
                break;
            case PlayerStates.SLIDING:
                slideAction.play();
                initiateSliding();
                break;
            default:
                idleAction.play();  // And corrected here
        }

        lastState = currentState;
    }
}


let initialSlideBoost = 0.2;  // Set the initial speed boost value

function initiateSliding() {
    let slidingStartTime = null;
    let originalY = null;

    if (!isSliding) {
        slidingStartTime = Date.now();
        originalY = player.position.y;
        isSliding = true;
    }

    let targetY = originalY - 1.65;

    // Disable state updates for the duration of the slide animation
    allowStateUpdate = false;

    const totalDuration = 120; // total duration in frames

    function slideLoop() {
        const elapsedTime = Date.now() - slidingStartTime;

        // Assuming your frame rate is around 60fps, then 120 frames would be about 2000ms.
        const totalDurationMs = 1850;
        const t = Math.min(elapsedTime / totalDurationMs, 1);

        // These thresholds determine when each phase of the piecewise function begins/ends
        const threshold1 = 0.165;  // 10% of the total duration
        const threshold2 = 0.6;  // 80% of the total duration

        if (t <= threshold1) {
            // Phase 1: Rapid decline
            player.position.y = originalY + (targetY - originalY) * (t / threshold1);
        } else if (t <= threshold2) {
            // Phase 2: Flat section
            player.position.y = targetY;
        } else {
            // Phase 3: Gentle increase
            const phase3Progress = (t - threshold2) / (1 - threshold2);
            player.position.y = targetY + (originalY - targetY) * phase3Progress;
        }

        if (t < 1) {
            requestAnimationFrame(slideLoop);
        } else {
            // Reset the player's position after sliding
            player.position.y = originalY;
            isSliding = false;
            allowStateUpdate = true;
        }
    }

    slideLoop();
}

function removeTranslationFromAnimation(clip) {
    clip.tracks = clip.tracks.filter(track => {
        return !track.name.endsWith('.position');
    });
}

export { initPlayer, updatePlayer, isSliding};