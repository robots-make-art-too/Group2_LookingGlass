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
    let scene = document.querySelector('a-scene');
    let assets = document.querySelector('a-assets');

    // First we need to initialize the model the pet will be using
    let model = document.createElement('a-asset-item');
    model.setAttribute('id', 'pet-gltf');
    model.setAttribute('src', source);
    assets.appendChild(model);

    // Then, we need to create the pet object from that model
    let petEntity = document.createElement('a-entity');
    petEntity.setAttribute('id', 'pet');
    petEntity.setAttribute('gltf-model', '#pet-gltf');
    petEntity.object3D.position.set(0, 0, -1);
    petEntity.object3D.scale.set(0.005, 0.005, 0.005);
    scene.appendChild(petEntity);
}

function updateStatDisplay() {
    document.getElementById("name").textContent = pet.name;
    document.getElementById("happiness").textContent = pet.happiness;
    document.getElementById("hunger").textContent = pet.hunger;
    document.getElementById("activity").textContent = pet.activity;
}