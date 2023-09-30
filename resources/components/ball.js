import * as THREE from 'three';
import { scene } from './scene.js'; // If you're adding the ball directly to the main scene
import { footballTextures } from './assets.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

let ball;  // This will store the loaded ball model

//Load textures onto ball
function createBall() {
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


        //Position
        ball.position.set(59, 5, -118.15); // Positioning it slightly above the ground
        console.log("Three.js Mesh Ball Position:", ball.position);

        //Scale
        ball.scale.set(.008, .008, .008);

        scene.add(ball);
    });
}







    export { createBall, ball };