const UPDATE_TIME = 20000; // Time in ms to update stats
const CYCLES_TO_AGE = 20; // How many update cycles for pet to age one year
const IDLE_STAT_DECREASE = 1; // Amount to decrease each stat per update
const COOLDOWN_TIME = 60000; // Cooldown for using objects
const LAT_LONG_SECOND = 1/60/60;
const FEET_PER_LAT_SECOND = 100;
const FEET_PER_LONG_SECOND = 75;
const STEPS_PER_FOOT = 0.4;
var pet; // To be defined when pet is created
var objectConsumed = false; // So that a marker only spawns an object once each time it is brought into view
var feedCooldown = false, playCooldown = false;
var totalSteps = 0;

window.onload = function() {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
        window.stop();
        alert("This application is only supported on mobile devices. Please open this page on a phone or tablet.")
        window.location.href = "/";
    } else createPet();

    const markerArr = Array.apply(null, document.querySelectorAll("a-marker"));

    markerArr.forEach(marker =>
            marker.addEventListener("markerFound", (e) => {
            console.log(marker.id);
            if (objectConsumed == false) {
                switch (marker.id) {
                    case 'tennis-ball-marker':
                        petPlay(15);
                        break;
                    case 'bone-marker':  
                        petPlay(20);
                        break;
                    case 'orbit-ball-marker':
                        petPlay(25);
                        break;
                    case 'pet-food-marker':
                        petFeed(20);
                        break;
                    case 'cake-marker':
                        petFeed(25);
                        break;
                }
            }
            objectConsumed = true;
        })
    );

    markerArr.forEach(marker =>
            marker.addEventListener("markerLost", (e) => {
            objectConsumed = false;
        })
    );
}

class Pet {
    constructor(name) {
        this.name = name;
        this.age = 0;
        this.updateCycles = 0;
        this.happiness = 50;
        this.hunger = 50;
        this.activity = 50;
        this.state = 'idle';
    }
}

function createPet() {
    let name = prompt("What will you name your pet?", "Scrumbus");
    pet = new Pet(name);

    spawnNewPet('/assets/sprites/idle-pet.png');
    document.getElementById("petInfo").style.display = "block";
    updateStatDisplay();
    setInterval(routineStatCheck, UPDATE_TIME);
    gpsStepTracker();
}

function spawnNewPet(source) {
    let scene = document.querySelector('a-scene');
    // let assets = document.querySelector('a-assets');

    // // First we need to initialize the model the pet will be using
    // let model = document.createElement('a-asset-item');
    // model.setAttribute('id', 'pet-gltf');
    // model.setAttribute('src', source);
    // assets.appendChild(model);

    // Then, we need to create the pet object from that model
    let petEntity = document.createElement('a-image');
    petEntity.setAttribute('id', 'pet');
    petEntity.setAttribute('src', source);
    petEntity.setAttribute('position', '0 0 -5');
    petEntity.setAttribute('width', 2);
    petEntity.setAttribute('height', 2);
    scene.appendChild(petEntity);
}

function updateStatDisplay() {
    // Automatic pet state changer
    if (pet.happiness <= 10) {
        if (pet.state != 'sad') stateChanger('sad');
    } else if (pet.hunger <= 20) {
        if (pet.state != 'hungry') stateChanger('hungry');
    } else if (pet.happiness >= 80) {
        if (pet.state != 'happy') stateChanger('happy');
    } else if (pet.state != 'idle') {
        stateChanger('idle');
    }

    // Pet death
    if (pet.happiness < 0 && pet.hunger < 0 && pet.activity < 0) {
        alert(`${pet.name} passed away...`);
        let toContinue = confirm("Would you like to create a new pet?");
        if (toContinue == true) {
            // THIS IS A TEMPORARY FIX
            location.reload();
        } else {
            alert(`Your pet ${pet.name} lived for ${pet.age} years. Thanks for playing!`);
            window.location.href = "/";
        }
    }

    // Otherwise don't go below zero
    if (pet.happiness < 0) pet.happiness = 0;
    if (pet.hunger < 0) pet.hunger = 0;
    if (pet.activity < 0) pet.activity = 0;

    // Also don't go above 100
    if (pet.happiness > 100) pet.happiness = 100;
    if (pet.hunger > 100) pet.hunger = 100;
    if (pet.activity > 100) pet.activity = 100;

    // Edit stat display
    document.getElementById("name").textContent = pet.name;
    document.getElementById("age").textContent = pet.age;
    document.getElementById("happiness").textContent = pet.happiness;
    document.getElementById("hunger").textContent = pet.hunger;
    document.getElementById("activity").textContent = pet.activity;
}

function routineStatCheck() {
    pet.happiness -= IDLE_STAT_DECREASE;
    pet.hunger -= IDLE_STAT_DECREASE;
    pet.activity -= IDLE_STAT_DECREASE;

    pet.updateCycles++;
    if (pet.updateCycles % CYCLES_TO_AGE == 0) {
        pet.age++;
    }
    
    updateStatDisplay();
}

// Base pet actions
function petFeed(statBoost) {
    if (pet.hunger >= 100) {
        drawPetAction(pet.name + " is already full!");
    } else if (unhappyDraw(0.25)) {
        drawPetAction(pet.name + " refused to eat!");
    } else if (feedCooldown === true) {
        drawPetAction("You're feeding your pet too fast!\r\n Slow down a little.");
    } else {
        pet.hunger += statBoost;
        drawPetAction(pet.name + ` gained ${statBoost} satiation!`);
        feedCooldown = true;
        setTimeout("endCooldown('feed')", COOLDOWN_TIME);
        updateStatDisplay();
    }
}

function petPlay(statBoost) {
    if (unhappyDraw(20, 0.25)) {
        drawPetAction(pet.name + " refused to play!");
    } else if (playCooldown === true) {
        drawPetAction("You're playing with your pet too much!\r\n Slow down a little.");
    } else {
        pet.happiness += statBoost;
        playCooldown = true;
        setTimeout("endCooldown('play')", COOLDOWN_TIME);
        drawPetAction(`${pet.name} gained ${statBoost} happiness!`);
        updateStatDisplay();
    }
}

function petWalk() {
    if (unhappyDraw(20, 0.25)) {
        drawPetAction(`${pet.name} refused to walk!`);
    } else if (pet.hunger < 10) {
        drawPetAction(`${pet.name} is too hungry to walk!`);
    } else {
        drawPetAction("Start walking to gain activity points!");
        updateStatDisplay();
    }
}

function gpsStepTracker() {
    let oldCoords = [], newCoords = [];
    let sessionSteps = 0;
    let id = navigator.geolocation.watchPosition(
        data => {
            newCoords = [data.coords.latitude, data.coords.longitude];
            if (oldCoords.length == 0) {
                oldCoords = [...newCoords];
            } else if (oldCoords[0] != newCoords[0] || (oldCoords[1] != newCoords[1])) {
                let latChange = Math.abs(newCoords[0] - oldCoords[0]);
                let longChange = Math.abs(newCoords[1] - oldCoords[1]);
                oldCoords = [...newCoords];

                // Time for some calculations
                let latSeconds = latChange / LAT_LONG_SECOND;
                let longSeconds = longChange / LAT_LONG_SECOND;
                let latFeet = latSeconds * FEET_PER_LAT_SECOND;
                let longFeet = longSeconds * FEET_PER_LONG_SECOND;
                let latSteps = latFeet * STEPS_PER_FOOT;
                let longSteps = longFeet * STEPS_PER_FOOT;

                if (latSteps >= 0.6 || longSteps >= 0.6) {
                    sessionSteps += Math.round(latSteps + longSteps);
                    totalSteps += sessionSteps;
                }

                drawPetAction(totalSteps); // TEMP

                let activityPoints = sessionSteps / 50;
                if (activityPoints >= 10) {
                    pet.activity += Math.round(activityPoints);
                    updateStatDisplay();
                    drawPetAction(`${pet.name} gained ${activityPoints} activity points!`)
                    sessionSteps = 0;
                }
            }
        },
        e => console.log("Error: " + e), {
            enableHighAccuracy: true
        }
    );

}

// Misc functions
function unhappyDraw(threshold, chance) {
    return (pet.happiness <= threshold && Math.random() <= chance);
}

function stateChanger(state) {
    pet.state = state;
    document.getElementById("pet").setAttribute('src', '/assets/sprites/' + state + '-pet.png');
}

function drawPetAction(str) {
    document.getElementById("petAction").style.display = "block";
    document.getElementById("pet-action-content").textContent = str;
    setTimeout(hidePetAction, 4000);
}

function hidePetAction() {
    document.getElementById("petAction").style.display = "none";
}

function endCooldown(type) {
    if (type == 'feed') feedCooldown = false;
    else if (type == 'play') playCooldown = false;
}