export class BattleSystem {
    constructor(playerShip, enemyShip) {
        this.playerShip = playerShip;
        this.enemyShip = enemyShip;
        this.turn = 0;
        this.logs = [];
    }

    calculateDamage(attacker, defender) {
        const baseDamage = attacker.stats.attack;
        const defense = defender.stats.defense;
        const damage = Math.max(1, baseDamage - defense * 0.5);
        return Math.floor(damage);
    }

    async executeTurn() {
        this.turn++;
        
        // 玩家回合
        const playerDamage = this.calculateDamage(this.playerShip, this.enemyShip);
        this.enemyShip.stats.energy -= playerDamage;
        this.logs.push(`回合 ${this.turn}: ${this.playerShip.name} 对 ${this.enemyShip.name} 造成 ${playerDamage} 点伤害`);

        if (this.enemyShip.stats.energy <= 0) {
            return { winner: 'player', logs: this.logs };
        }

        // 敌人回合
        const enemyDamage = this.calculateDamage(this.enemyShip, this.playerShip);
        this.playerShip.stats.energy -= enemyDamage;
        this.logs.push(`回合 ${this.turn}: ${this.enemyShip.name} 对 ${this.playerShip.name} 造成 ${enemyDamage} 点伤害`);

        if (this.playerShip.stats.energy <= 0) {
            return { winner: 'enemy', logs: this.logs };
        }

        return { winner: null, logs: this.logs };
    }
} 