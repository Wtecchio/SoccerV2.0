import * as THREE from 'three';
import * as CANNON from 'cannon'
import { ball } from './ball.js';
import { scene } from './scene.js'



let world;             // This will hold the physics world
export let ballBody;          // This will hold the ball's physics body
let ballWireframe;     // This will hold the wireframe visualization for the ball's physics body


function initPhysics() {
    return new Promise((resolve, reject) => {
        try {
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
            let ballShape = new CANNON.Sphere(.5);
            ballBody = new CANNON.Body({ mass: 1 });
            ballBody.addShape(ballShape);
            ballBody.position.set(59, 5, -118.15);
            world.addBody(ballBody)

            //
            //DEBUG VECTORS DELETE ALL LATER
            //
            if (ballBody) {
                ballBody.addEventListener("collide", function (event) {
                    console.log("Collision detected!");
                    console.log("Collision detected with body id:", event.body.id);

                    // Get the contact normal. Note: this may need to be flipped to point in the correct direction.
                    const contactNormal = event.contact.ni;

                    // Get the contact point
                    const contactPoint = event.contact.ri;

                    // Convert Cannon.js vectors to Three.js vectors
                    const threeContactNormal = new THREE.Vector3(contactNormal.x, contactNormal.y, contactNormal.z);
                    const threeContactPoint = new THREE.Vector3(contactPoint.x, contactPoint.y, contactPoint.z);

                    // Create a line to visualize the normal
                    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
                    const geometry = new THREE.BufferGeometry().setFromPoints([threeContactPoint, threeContactPoint.clone().add(threeContactNormal.multiplyScalar(5))]);
                    const normalLine = new THREE.Line(geometry, material);

                    // Add the line to your Three.js scene
                    scene.add(normalLine);

                    // Optionally, remove the line after a certain amount of time
                    setTimeout(() => {
                        scene.remove(normalLine);
                        geometry.dispose();
                        material.dispose();
                    }, 10000);  // Remove after 1000ms
                });
            }

            //
            //END OF VECTOR DEBUG
            //


            // Create a wireframe visualization for the ball's physics body FOR DEBUGGING ONLY
            const wireframeGeometry = new THREE.SphereGeometry(.5);
            const wireframeMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true
            });
            ballWireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
            ballWireframe.position.set(59, 5, -118.15)
            scene.add(ballWireframe);

            // Resolve the promise to indicate that physics initialization is complete
            resolve();

        } catch (error) {
            // If any error occurs during the setup, reject the promise
            console.error('An error occurred while initializing physics:', error);
            reject(error);
        }
    });
}





// Function to update the physics world
function updatePhysics(deltaTime) {
    world.step(1 / 60);

    if (ball && ballBody) {  // Safety check
        // Synchronize the graphics object with the physics object:
        ball.position.copy(ballBody.position);
        ball.quaternion.copy(ballBody.quaternion);

        // If ball.velocity is not defined, define it
        if (!ball.velocity) {
            ball.velocity = new THREE.Vector3();
        }

        // Synchronize the velocity
        ball.velocity.copy(ballBody.velocity);

        ballWireframe.position.copy(ballBody.position);
        ballWireframe.quaternion.copy(ballBody.quaternion);
    }
}
export { initPhysics, updatePhysics };