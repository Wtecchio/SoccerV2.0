// JavaScript source code
import * as THREE from 'three';

// Import  ball texture paths
import footballBaseColorURL from '../models/textures/footballBaseColor.png';
import footballMixedAOURL from '../models/textures/footballMixedAO.png';
import footballNormalURL from '../models/textures/footballNormalOpenGL.png';
import footballRoughnessURL from '../models/textures/footballRoughness.png';

// Define a texture loader to load the textures
const textureLoader = new THREE.TextureLoader();

// Object to hold the loaded textures for the footballs
const footballTextures = {};

function loadFootballTextures() {
    return new Promise((resolve) => {
        let assetsLoaded = 0;
        const totalAssets = 4;  // Total number of football textures

        function checkAllAssetsLoaded() {
            assetsLoaded++;
            if (assetsLoaded === totalAssets) {
                resolve();

            }
        }

        // Load the football base color texture
        textureLoader.load(footballBaseColorURL, texture => {
            footballTextures.baseColor = texture;
            checkAllAssetsLoaded();
        });

        // Load the football mixed color texture
        textureLoader.load(footballMixedAOURL, texture => {
            footballTextures.mixedAO = texture;
            checkAllAssetsLoaded();
        });

        // Load the football normal color texture
        textureLoader.load(footballNormalURL, texture => {
            footballTextures.normal = texture;
            checkAllAssetsLoaded();
        });

        // Load the football roughness color texture
        textureLoader.load(footballRoughnessURL, texture => {
            footballTextures.roughness = texture;
            checkAllAssetsLoaded();
        });
    });
}

export async function loadAssets() {
    // Await ensures that the function only completes once all assets are loaded
    await loadFootballTextures();
    // await loadPlayerTextures();  // Uncomment when you have player textures to load
    // await loadStadiumTextures();  // Uncomment when you have stadium textures to load
}

export { footballTextures };