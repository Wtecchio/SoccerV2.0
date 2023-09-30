import * as THREE from 'three';
import { scene } from './scene.js';
import { ColladaLoader } from '../jsLib/ColladaLoader.js';  // Update with the correct path


//import .dae
import fieldModel from '../models/campFutbol.dae';

function createField() {
    // Create a loader for the .dae file
    const loader = new ColladaLoader();


    // Load the .dae model
    loader.load(
        fieldModel,
        (collada) => {
            const model = collada.scene;


            // You can scale, rotate, or position the model as needed
            model.scale.set(.1, .1, .1);  // Adjust the scale as necessary
            model.position.set(0, 0, 0)

            // Add the model to the scene
            scene.add(model);
            console.log("Model loaded and added to the scene");
        },
        undefined,  // This is the onProgress callback, which we're not using here
        (error) => {
            console.error("There was an error loading the .dae file:", error.message);
        }
    );
}

export { createField };
