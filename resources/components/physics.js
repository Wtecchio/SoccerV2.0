import * as THREE from 'three';
import * as CANNON from 'cannon'
import { ball } from './ball.js';
import { scene } from './scene.js'


let world;             // This will hold the physics world
export let ballBody;          // This will hold the ball's physics body
let ballWireframe;     // This will hold the wireframe visualization for the ball's physics body

function initPhysics() {
    // Initialize the physics world:
    world = new CANNON.World();
    world.gravity.set(0, -9.81, 0);  // Setting gravity in the negative y direction

    // Define Materials:
    const ballMaterial = new CANNON.Material('ballMaterial');
    const groundMaterial = new CANNON.Material('groundMaterial');


    // Contact properties when ball hits the ground:
    const ballGroundContact = new CANNON.ContactMaterial(ballMaterial, groundMaterial, {
        friction: 0.5,
        restitution: 0.7
    });
    world.addContactMaterial(ballGroundContact);

    // Ground physics:
    let groundShape = new CANNON.Plane();  // Assuming the ground is a flat plane
    let groundBody = new CANNON.Body({ mass: 0 });  // Setting mass to 0 makes it static
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);  // Rotate to align with the ground
    groundBody.position.y = 0.1;  // Raise the ground by 0.1 units
    world.addBody(groundBody);

    // Ball Physics:
    let ballShape = new CANNON.Sphere(.75);  // Assuming the ball has a radius of 0.2 units
    ballBody = new CANNON.Body({ mass: 1 });  // Adjust mass as needed
    ballBody.addShape(ballShape);
    ballBody.position.set(59, 5, -118.15);  // Starting 5 units above the ground, adjust as needed
    world.addBody(ballBody);


    // Create a wireframe visualization for the ball's physics body FOR DEBUGGING ONLY
    /*
    const wireframeGeometry = new THREE.SphereGeometry(.75);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });
    ballWireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    ballWireframe.position.set(59, 5, -118.15)
    scene.add(ballWireframe);
    */
}


// Function to update the physics world
function updatePhysics(deltaTime) {
    world.step(1/60);

    if (ball && ballBody) {  // Safety check
        // Synchronize the graphics object with the physics object:
        ball.position.copy(ballBody.position);
        ball.quaternion.copy(ballBody.quaternion);
        //console.log("Ball Position:", ballBody.position);


    }
}

export { initPhysics, updatePhysics };