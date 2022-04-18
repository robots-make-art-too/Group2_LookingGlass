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
    alert(pet.name);
}