export class Mission {
    constructor(id, title, description, type, difficulty, rewards) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type; // 'main' 或 'side'
        this.difficulty = difficulty;
        this.rewards = rewards;
        this.completed = false;
    }
} 