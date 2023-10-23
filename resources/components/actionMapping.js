import { getPlayerState, getHasBall, updatePlayerState } from './playerState.js';

// Define key mappings for actions
const keyMappings = {
    shoot: 'r',  // 'r' key for shooting
    passSlide: ' ',  // Space bar key for pass or slide
    sprint: 'Shift'  // Control key for sprint
};

export function handleActions(keyState) {
    const playerState = getPlayerState();
    const hasBall = getHasBall();

    // Handle Shoot
    if (keyState[keyMappings.shoot]) {
        if (hasBall) {
            // Execute shooting logic here
            console.log("Shooting the ball!");
        }
    }

    // Handle Pass/Slide
    if (keyState[keyMappings.passSlide]) {
        if (playerState === 'running' && !hasBall) {
            // Execute sliding logic here
            //console.log("Triggering slide");  // Add this line for debugging
            updatePlayerState(true);  // Trigger slide
            console.log("Sliding!");
        } else if (hasBall) {
            // Execute passing logic here
            console.log("Passing the ball!");
        }
    }

    // Handle Sprint
    if (keyState[keyMappings.sprint]) {
        // Execute sprinting logic here
        console.log("Sprinting!");
    }
}