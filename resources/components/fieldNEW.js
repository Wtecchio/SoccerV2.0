import * as THREE from 'three';
import { scene } from './scene.js'; 
import { GLTFLoader } from '../jsLib/GLTFLoader.js';  // Update with the correct path



//load field
import fieldModel from '../models/SoccerField/scene.gltf';

function createField() {
    // Create a loader for the .dae file
    const loader = new GLTFLoader();


    console.log("loader made");
    console.log(window.location.pathname);
    // Load the .dae model
    loader.load(
        fieldModel,
        (gltf) => {
            const model = gltf.scene;

            console.log("work?");

            // You can scale, rotate, or position the model as needed
            model.scale.set(.1, .1, .1);  // Adjust the scale as necessary
            model.position.set(0, 0, 0)

            // Add the model to the scene
            scene.add(model);
            console.log("Model loaded and added to the scene");
        },
        undefined,  // This is the onProgress callback, which we're not using here
        (error) => {
            console.error("There was an error loading the .gltf file:", error.message);
        }
    );
}

export { createField };
