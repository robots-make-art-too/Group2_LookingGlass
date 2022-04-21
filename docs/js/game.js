const UPDATE_TIME = 5000; // Time in ms to update stats
const IDLE_STAT_DECREASE = 1; // Amount to decrease each stat per update
var pet; // To be defined when pet is created

class Pet {
    constructor(name) {
        this.name = name;
        this.age = 0;
        this.happiness = 50;
        this.hunger = 50;
        this.activity = 50;
    }
}

AFRAME.registerComponent('marker-handler', {
    tick: function() {
        let objectConsumed = false;
        let activeMarker = document.querySelector("a-marker");

        if(activeMarker.object3D.visible == true && objectConsumed == true) {
            switch (activeMarker.id) {
                case 'tennis-ball-marker':
                    alert("Tennis ball");
                    break;
                default:
                    alert("Something else");
                    break;
            }
            objectConsumed = true;
        } else {
            objectConsumed = false;
        }
    }
});

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
    updateStatDisplay();
}

// Base pet actions
function petFeed() {
    if (pet.hunger >= 100) {
        alert(pet.name + " is already full!");
    } else if (unhappyDraw(0.25)) {
        alert(pet.name + " refused to eat!");
    } else {
        pet.hunger += 25;
        alert(pet.name + " gained 25 satiation!");
        updateStatDisplay();
    }
}

function petPlay() {
    if (unhappyDraw(20, 0.25)) {
        alert(pet.name + " refused to play!");
    } else {
        pet.happiness += 25;
        alert(pet.name + " gained 25 happiness!");
        updateStatDisplay();
    }
}

function petWalk() {
    if (unhappyDraw(20, 0.25)) {
        alert(pet.name + " refused to walk!");
    } else if (pet.hunger < 10) {
        alert(pet.name + " is too hungry to walk!");
    } else {
        pet.activity += 25;
        alert(pet.name + " gained 25 activity points!");
        updateStatDisplay();
    }
}

// Misc functions
function unhappyDraw(threshold, chance) {
    return (pet.happiness <= threshold && Math.random() <= chance);
}

function stateChanger(state) {
    document.getElementById("pet").setAttribute('src', '/assets/sprites/' + state + '-pet.png');
}