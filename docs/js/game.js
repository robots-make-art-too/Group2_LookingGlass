const UPDATE_TIME = 20000; // Time in ms to update stats
const CYCLES_TO_AGE = 20;
const IDLE_STAT_DECREASE = 1; // Amount to decrease each stat per update
var pet; // To be defined when pet is created
var objectConsumed = false; // So that a marker only spawns an object once each time it is brought into view

window.onload = function() {
    createPet();

    let activeMarker = document.querySelector("a-marker");

    activeMarker.addEventListener("markerFound", (e) => {
        console.log(activeMarker.id);
        if (objectConsumed == false) {
            switch (activeMarker.id) {
                case 'tennis-ball-marker':
                    petPlay(15);
                    break;
                case 'bone-marker':    
                    petActivity(20);
                    break;
                case 'orbit-ball-marker':
                    petPlay(25);
                    break;
                case 'pet-food-marker':
                    petFeed(20);
                    break;
                case 'cake-marker':
                    petFeed(30);
                    break;
            }
        }
        objectConsumed = true;
    })

    activeMarker.addEventListener("markerLost", (e) => {
        objectConsumed = false;
    })
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

    // Otherwise on't go below zero
    if (pet.happiness < 0) pet.happiness = 0;
    if (pet.hunger < 0) pet.hunger = 0;
    if (pet.activity < 0) pet.activity = 0;

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
    } else {
        pet.hunger += statBoost;
        drawPetAction(pet.name + ` gained ${statBoost} satiation!`);
        updateStatDisplay();
    }
}

function petPlay(statBoost) {
    if (unhappyDraw(20, 0.25)) {
        drawPetAction(pet.name + " refused to play!");
    } else {
        pet.happiness += statBoost;
        drawPetAction(pet.name + ` gained ${statBoost} happiness!`);
        updateStatDisplay();
    }
}

function petWalk() {
    if (unhappyDraw(20, 0.25)) {
        drawPetAction(pet.name + " refused to walk!");
    } else if (pet.hunger < 10) {
        drawPetAction(pet.name + " is too hungry to walk!");
    } else {
        pet.activity += 25;
        drawPetAction(pet.name + " gained 25 activity points!");
        updateStatDisplay();
    }
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
    setTimeout(hidePetAction, 5000);
}

function hidePetAction() {
    document.getElementById("petAction").style.display = "none";
}