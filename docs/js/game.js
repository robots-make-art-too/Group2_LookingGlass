class Pet {
    constructor(name) {
        this.name = name;
        this.age = 0;
        this.happiness = 100;
        this.hunger = 100;
        this.activity = 100;
    }
}

function createPet() {
    let name = prompt("What will you name your pet?", "Big Floppa");
    pet = new Pet(name);

    spawnNewPet('/assets/models/cube.glb');

    document.getElementById("petInfo").style.display = "block";
    updateStatDisplay();
}

function spawnNewPet(source) {
    var scene = document.querySelector('a-scene');
    var assets = document.querySelector('a-assets');

    // First we need to initialize the model the pet will be using
    var model = document.createElement('a-asset-item');
    model.setAttribute('id', 'pet-gltf');
    model.setAttribute('src', source);
    assets.appendChild(model);

    // Then, we need to create the pet object from that model
    var pet = document.createElement('a-entity');
    pet.setAttribute('id', 'pet');
    pet.setAttribute('gltf-model', '#pet-gltf');
    pet.setAttribute('position', '0 0 0');
    scene.appendChild(pet);
}

function updateStatDisplay() {
    document.getElementById("name").textContent = pet.name;
    document.getElementById("happiness").textContent = pet.happiness;
    document.getElementById("hunger").textContent = pet.hunger;
    document.getElementById("activity").textContent = pet.activity;
}