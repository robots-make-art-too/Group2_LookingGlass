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

    spawnNewPet();

    document.getElementById("petInfo").style.display = "block";
    updateStatDisplay();
}

function spawnNewPet() {
    var scene = document.querySelector('a-scene');
    var pet = document.createElement('a-entity');
    pet.setAttribute('id', cube);
    pet.setAttribute('gltf-model', document.querySelector('#cube-gltf'));
    pet.setAttribute('position', '0 0 0');
    scene.appendChild(pet);
}

function updateStatDisplay() {
    document.getElementById("name").textContent = pet.name;
    document.getElementById("happiness").textContent = pet.happiness;
    document.getElementById("hunger").textContent = pet.hunger;
    document.getElementById("activity").textContent = pet.activity;
}