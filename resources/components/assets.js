import * as THREE from 'three';
// Define a texture loader to load the textures
const textureLoader = new THREE.TextureLoader();

// Object to hold the loaded textures for the football
const footballTextures = {};

// Object to hold loaded player textures (as an example for future expansion)
// const playerTextures = {};

// Object to hold loaded stadium textures (as an example for future expansion)
// const stadiumTextures = {};

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
        textureLoader.load('./resources/models/textures/football_Base_Color.png', texture => {
            footballTextures.baseColor = texture;
            checkAllAssetsLoaded();
        });

        // Load the football mixed color texture
        textureLoader.load('./resources/models/textures/football_Mixed_AO.png', texture => {
            footballTextures.mixedAO = texture;
            checkAllAssetsLoaded();
        });

        // Load the football normal color texture
        textureLoader.load('./resources/models/textures/football_Normal_OpenGL.png', texture => {
            footballTextures.normal = texture;
            checkAllAssetsLoaded();
        });

        // Load the football roughness color texture
        textureLoader.load('./resources/models/textures/football_Roughness.png', texture => {
            footballTextures.roughness = texture;
            checkAllAssetsLoaded();
        });

    });
}

// Example function for loading player textures in the future
// function loadPlayerTextures() {
//     return new Promise((resolve) => {
//         // Loading logic for player textures
//         // ...
//     });
// }

// Example function for loading stadium textures in the future
// function loadStadiumTextures() {
//     return new Promise((resolve) => {
//         // Loading logic for stadium textures
//         // ...
//     });
// }

export async function loadAssets() {
    // Await ensures that the function only completes once all assets are loaded
    await loadFootballTextures();
    // await loadPlayerTextures();  // Uncomment when you have player textures to load
    // await loadStadiumTextures();  // Uncomment when you have stadium textures to load
}

export { footballTextures };  // Exporting the loaded textures for use in other components