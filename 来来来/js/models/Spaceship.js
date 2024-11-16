class Spaceship {
    constructor(id, name, type, level = 1) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.level = level;
        this.stats = {
            attack: 10 + level * 2,
            defense: 8 + level * 1.5,
            speed: 5 + level,
            energy: 100 + level * 10
        };
        this.skills = [];
    }

    upgrade() {
        this.level++;
        this.updateStats();
    }

    updateStats() {
        this.stats.attack = 10 + this.level * 2;
        this.stats.defense = 8 + this.level * 1.5;
        this.stats.speed = 5 + this.level;
        this.stats.energy = 100 + this.level * 10;
    }
} 