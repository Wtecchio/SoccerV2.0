import * as THREE from 'three';
import { ball } from './ball.js';
import { ballBody } from './physics.js';
import { scene } from './scene.js'; 
import { player } from './player.js';

let ballArrow;
let playerArrow;


function initVectors() {

    ballArrow = new THREE.ArrowHelper(
        new THREE.Vector3(), // direction
        new THREE.Vector3(), // origin
        50, // length
        0xff0000 // color
    );
    scene.add(ballArrow);

    playerArrow = new THREE.ArrowHelper(
        new THREE.Vector3(),
        new THREE.Vector3(),
        10000,
        0x00ff00
    );
    scene.add(playerArrow);

}

function updateVectors() {
    if (ball && player && ball.velocity && player.velocity) {
        ballArrow.position.copy(ball.position);
        ballArrow.setDirection(ball.velocity.normalize());
        ballArrow.setLength(ball.velocity.length());

        playerArrow.position.copy(player.position);
        playerArrow.setDirection(player.velocity.normalize());
        playerArrow.setLength(player.velocity.length());

    //console.log('Ball:', ball);

       

    }
    //console.log('Ball:', ball);
    //console.log('Player:', player);
    //console.log('PlayerVelocity:', player.velocity);

}

export { initVectors, updateVectors };