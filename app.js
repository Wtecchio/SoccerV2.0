import { scene, initScene, camera, renderer } from './resources/components/scene.js';
import { loadAssets } from './resources/components/assets.js';
import { createField } from './resources/components/field.js';
import { createBall } from './resources/components/ball.js';
import { initPhysics, updatePhysics } from './resources/components/physics.js';
import { initControls, updateControls } from './resources/components/controls.js';
import { initPlayer, updatePlayer, mixer } from './resources/components/player.js';
import { applyMagneticEffect } from './resources/components/magnet.js';
import { updatePlayerState } from './resources/components/playerState.js';
import { initVectors, updateVectors } from './resources/components/debugVectors.js';  // Adjust path as needed
//import { initScore, updateScore } from './resources/components/score.js';
//import { animate } from './resources/components/animations.js';



(async function main() {


    // Initialization

    initScene();

    // Load assets MIGHT NOT NEED FOR NOW
    await loadAssets();


    // Create field
    createField();

    // Create ball
    await createBall();



    // Initialize physics
    await initPhysics();

    //Initialize player
    await initPlayer();


    //DEBUG PHYSICS VECTORS
    initVectors();

    if (mixer) {
        console.log("Available actions in mixer:", mixer._actions);
    }

    // Initialize controls
    //initControls();


    // Initialize scoring system
    //initScore();




    let previousTime = performance.now();

    // Main game loop
    function gameLoop(currentTime) {


        //ADD TICK RATE
        const deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;

        // Update controls
        updateControls();

        // Update player state based on current conditions
        updatePlayerState();  

        // Update player
        updatePlayer(deltaTime);


        // Update physics
        updatePhysics(deltaTime);

        // Apply the magnetic effect between player and ball
        applyMagneticEffect();



        //for debugging vector forces debug when done
        updateVectors();

        if (mixer) {  // Check if mixer exists
            mixer.update(deltaTime);
        }

        // Update scoring system
       // updateScore();

        // Render animations
       // animate();

        // Render the scene
        renderer.render(scene, camera);

        // Request the next frame
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
})();
