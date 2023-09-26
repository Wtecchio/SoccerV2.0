import { scene, initScene, camera, renderer } from './resources/components/scene.js';
import { loadAssets } from './resources/components/assets.js';
import { createField } from './resources/components/field.js';
import { createBall } from './resources/components/ball.js';
import { initPhysics, updatePhysics } from './resources/components/physics.js';
import { initControls, updateControls } from './resources/components/controls.js';
//import { initPlayer, updatePlayer } from './resources/components/player.js';
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
    createBall();

    // Initialize physics
    initPhysics();

    // Initialize controls
    //initControls();

    //Initialize player
    //initPlayer();

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

        // Update physics
        updatePhysics(deltaTime);

        // Update player
        //updatePlayer();

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