class Game {
    constructor() {
        this.currentScreen = 'main-menu';
        this.screens = {};
        this.playerData = {
            gold: 1000,
            diamond: 10,
            spaceships: [],
            completedMissions: [],
            inventory: [],
            currentMission: null,
            missionProgress: {
                enemiesDefeated: 0,
                itemsCollected: 0,
                exploredAreas: 0
            }
        };
        
        // 加载存档
        const savedData = localStorage.getItem('gameData');
        if (savedData) {
            this.playerData = JSON.parse(savedData);
        }
        
        this.init();
    }

    init() {
        // 初始化所有屏幕
        document.querySelectorAll('.screen').forEach(screen => {
            this.screens[screen.id] = screen;
        });

        // 添加按钮事件监听
        document.querySelectorAll('button[data-screen]').forEach(button => {
            button.addEventListener('click', () => {
                this.switchScreen(button.dataset.screen);
            });
        });

        // 初始化玩家数据
        this.initializePlayerData();
    }

    initializePlayerData() {
        if (this.playerData.spaceships.length === 0) {
            const starterShip = GAME_DATA.SPACESHIPS[0];
            this.playerData.spaceships.push({
                ...starterShip,
                level: 1,
                stats: {
                    attack: starterShip.baseStats.attack,
                    defense: starterShip.baseStats.defense,
                    speed: starterShip.baseStats.speed,
                    energy: 100
                }
            });
            this.saveGame();
        }
    }

    saveGame() {
        localStorage.setItem('gameData', JSON.stringify(this.playerData));
    }

    switchScreen(screenId) {
        // 隐藏当前屏幕
        this.screens[this.currentScreen].classList.add('hidden');
        // 显示新屏幕
        this.screens[screenId].classList.remove('hidden');
        this.currentScreen = screenId;
        
        // 加载相应的内容
        this.loadScreenContent(screenId);
    }

    loadScreenContent(screenId) {
        switch(screenId) {
            case 'hangar':
                this.loadHangar();
                break;
            case 'missions':
                this.loadMissions();
                break;
            case 'shop':
                this.loadShop();
                break;
            case 'upgrade':
                this.loadUpgrade();
                break;
            case 'leaderboard':
                this.loadLeaderboard();
                break;
        }
    }

    loadHangar() {
        const hangarScreen = this.screens['hangar'];
        hangarScreen.innerHTML = `
            <h2>战舰库</h2>
            <div class="spaceship-list">
                ${this.playerData.spaceships.map(ship => `
                    <div class="spaceship-card">
                        <h3>${ship.name}</h3>
                        <div class="stats">
                            <p>等级: ${ship.level || 1}</p>
                            <p>攻击: ${ship.stats.attack}</p>
                            <p>防御: ${ship.stats.defense}</p>
                            <p>速度: ${ship.stats.speed}</p>
                            <p>能量: ${ship.stats.energy}</p>
                        </div>
                        <button onclick="game.selectSpaceship('${ship.id}')">选择</button>
                    </div>
                `).join('')}
            </div>
            <button onclick="game.switchScreen('main-menu')">返回</button>
        `;
    }

    selectSpaceship(shipId) {
        const ship = this.playerData.spaceships.find(s => s.id === shipId);
        if (ship) {
            this.playerData.selectedShip = shipId;
            this.saveGame();
            alert(`已选择战舰：${ship.name}`);
        }
    }

    loadMissions() {
        const missionsScreen = this.screens['missions'];
        missionsScreen.innerHTML = `
            <h2>任务中心</h2>
            <div class="missions-container">
                <div class="mission-type">
                    <h3>主线任务</h3>
                    ${this.renderMissions(GAME_DATA.MISSIONS.filter(m => m.type === 'main'))}
                </div>
                <div class="mission-type">
                    <h3>支线任务</h3>
                    ${this.renderMissions(GAME_DATA.MISSIONS.filter(m => m.type === 'side'))}
                </div>
            </div>
            ${this.playerData.currentMission ? this.renderCurrentMission() : ''}
            <button onclick="game.switchScreen('main-menu')">返回</button>
        `;
    }

    renderMissions(missions) {
        return missions.map(mission => `
            <div class="mission-card ${this.playerData.completedMissions.includes(mission.id) ? 'completed' : ''}">
                <h3>${mission.title}</h3>
                <p>${mission.description}</p>
                <div class="mission-info">
                    <p>难度: ${'★'.repeat(mission.difficulty)}</p>
                    <div class="rewards">
                        <p>奖励:</p>
                        ${this.formatRewards(mission.rewards)}
                    </div>
                </div>
                ${this.playerData.completedMissions.includes(mission.id) 
                    ? '<div class="mission-status completed">已完成</div>'
                    : this.playerData.currentMission?.id === mission.id
                        ? '<div class="mission-status ongoing">进行中</div>'
                        : `<button onclick="game.startMission('${mission.id}')">开始任务</button>`
                }
            </div>
        `).join('');
    }

    renderCurrentMission() {
        const mission = GAME_DATA.MISSIONS.find(m => m.id === this.playerData.currentMission.id);
        if (!mission) return '';

        return `
            <div class="current-mission">
                <h3>当前任务: ${mission.title}</h3>
                <div class="mission-progress">
                    ${this.getMissionProgress(mission)}
                </div>
                <button onclick="game.abandonMission()">放弃任务</button>
            </div>
        `;
    }

    getMissionProgress(mission) {
        switch(mission.type) {
            case 'main':
                return `
                    <p>击败敌人: ${this.playerData.missionProgress.enemiesDefeated}/3</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${(this.playerData.missionProgress.enemiesDefeated / 3) * 100}%"></div>
                    </div>
                `;
            case 'side':
                return `
                    <p>探索进度: ${this.playerData.missionProgress.exploredAreas}/5</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${(this.playerData.missionProgress.exploredAreas / 5) * 100}%"></div>
                    </div>
                `;
            default:
                return '';
        }
    }

    startMission(missionId) {
        if (!this.playerData.spaceships.length) {
            alert('请先选择一艘战舰！');
            return;
        }

        if (this.playerData.currentMission) {
            alert('请先完成或放弃当前任务！');
            return;
        }

        const mission = GAME_DATA.MISSIONS.find(m => m.id === missionId);
        if (!mission) return;

        this.playerData.currentMission = {
            id: missionId,
            startTime: Date.now()
        };
        this.playerData.missionProgress = {
            enemiesDefeated: 0,
            itemsCollected: 0,
            exploredAreas: 0
        };

        this.startBattle(mission);
        this.saveGame();
        this.loadMissions();
    }

    async startBattle(mission) {
        const battleScreen = document.createElement('div');
        battleScreen.className = 'battle-screen';
        
        // 获取玩家战舰和敌人数据
        const playerShip = this.playerData.spaceships.find(s => s.id === this.playerData.selectedShip);
        const enemy = GAME_DATA.ENEMIES[mission.id];
        
        // 初始化战斗数据
        this.battleData = {
            playerHP: playerShip.stats.energy,
            enemyHP: enemy.stats.hp,
            playerShip: playerShip,
            enemy: enemy,
            turn: 1,
            logs: []
        };

        battleScreen.innerHTML = `
            <div class="battle-screen-content">
                <h2>战斗中...</h2>
                
                <div class="battle-participants">
                    <div class="participant player">
                        <h3>${playerShip.name}</h3>
                        <div class="hp-bar">
                            <div class="hp-fill" style="width: 100%"></div>
                            <span class="hp-text">${this.battleData.playerHP}/${playerShip.stats.energy}</span>
                        </div>
                        <div class="stats">
                            <p>攻击: ${playerShip.stats.attack}</p>
                            <p>防御: ${playerShip.stats.defense}</p>
                            <p>速度: ${playerShip.stats.speed}</p>
                        </div>
                    </div>
                    
                    <div class="battle-vs">VS</div>
                    
                    <div class="participant enemy">
                        <h3>${enemy.name}</h3>
                        <div class="hp-bar">
                            <div class="hp-fill" style="width: 100%"></div>
                            <span class="hp-text">${this.battleData.enemyHP}/${enemy.stats.hp}</span>
                        </div>
                        <div class="stats">
                            <p>攻击: ${enemy.stats.attack}</p>
                            <p>防御: ${enemy.stats.defense}</p>
                            <p>速度: ${enemy.stats.speed}</p>
                        </div>
                    </div>
                </div>

                <div class="battle-log">
                    <div class="log-content"></div>
                </div>

                <div class="battle-controls">
                    <button onclick="game.performBattleAction('attack')" class="battle-btn attack">攻击</button>
                    <button onclick="game.performBattleAction('defend')" class="battle-btn defend">防御</button>
                    <button onclick="game.performBattleAction('skill')" class="battle-btn skill">技能</button>
                </div>
                
                <div class="turn-indicator">回合: ${this.battleData.turn}</div>
            </div>
        `;
        
        document.body.appendChild(battleScreen);
        this.updateBattleLog('战斗开始！');
    }

    performBattleAction(action) {
        const { playerShip, enemy } = this.battleData;
        let playerDamage = 0;
        let enemyDamage = 0;
        let logMessages = [];

        // 如果战斗已经结束，不应该继续执行
        if (this.battleData.enemyHP <= 0 || this.battleData.playerHP <= 0) {
            return;
        }

        switch(action) {
            case 'attack':
                // 计算玩家伤害
                playerDamage = Math.max(1, 
                    Math.floor(playerShip.stats.attack * (1 - enemy.stats.defense / 100)));
                this.battleData.enemyHP -= playerDamage;
                logMessages.push(`${playerShip.name} 对 ${enemy.name} 造成 ${playerDamage} 点伤害`);

                // 敌人反击
                if (this.battleData.enemyHP > 0) {
                    enemyDamage = Math.max(1, 
                        Math.floor(enemy.stats.attack * (1 - playerShip.stats.defense / 100)));
                    this.battleData.playerHP -= enemyDamage;
                    logMessages.push(`${enemy.name} 对 ${playerShip.name} 造成 ${enemyDamage} 点伤害`);
                }
                break;

            case 'defend':
                // 防御姿态减少50%伤害
                enemyDamage = Math.max(1, 
                    Math.floor(enemy.stats.attack * (1 - (playerShip.stats.defense + 50) / 100)));
                this.battleData.playerHP -= enemyDamage;
                logMessages.push(`${playerShip.name} 进入防御姿态`);
                logMessages.push(`${enemy.name} 对 ${playerShip.name} 造成 ${enemyDamage} 点伤害`);
                break;

            case 'skill':
                if (this.battleData.turn % 3 === 0) { // 每3回合可以使用一次技能
                    playerDamage = Math.floor(playerShip.stats.attack * 1.5);
                    this.battleData.enemyHP -= playerDamage;
                    logMessages.push(`${playerShip.name} 使用特殊技能，造成 ${playerDamage} 点伤害！`);
                } else {
                    logMessages.push('技能冷却中...');
                    return;
                }
                break;
        }

        // 更新战斗日志
        logMessages.forEach(msg => this.updateBattleLog(msg));
        
        // 更新UI
        this.updateBattleUI();
        
        // 检查战斗结果
        if (this.battleData.enemyHP <= 0) {
            this.updateBattleLog(`${enemy.name} 被击败！`);
            this.playerData.missionProgress.enemiesDefeated++;
            
            // 添加延迟，让玩家看到战斗结果
            setTimeout(() => {
                if (this.checkMissionComplete()) {
                    this.completeMission();
                } else {
                    // 如果任务还没完成，移除当前战斗界面
                    document.querySelector('.battle-screen').remove();
                    this.loadMissions(); // 刷新任务界面
                }
            }, 1000);
            
            return; // 立即返回，防止继续执行
        } else if (this.battleData.playerHP <= 0) {
            this.updateBattleLog(`${playerShip.name} 被击败！`);
            
            // 添加延迟，让玩家看到战斗结果
            setTimeout(() => {
                this.failMission();
            }, 1000);
            
            return; // 立即返回，防止继续执行
        }

        this.battleData.turn++;
        document.querySelector('.turn-indicator').textContent = `回合: ${this.battleData.turn}`;
    }

    updateBattleUI() {
        const { playerShip, enemy } = this.battleData;
        
        // 更新血条
        const playerHPPercent = (this.battleData.playerHP / playerShip.stats.energy) * 100;
        const enemyHPPercent = (this.battleData.enemyHP / enemy.stats.hp) * 100;
        
        document.querySelector('.player .hp-fill').style.width = `${Math.max(0, playerHPPercent)}%`;
        document.querySelector('.enemy .hp-fill').style.width = `${Math.max(0, enemyHPPercent)}%`;
        
        document.querySelector('.player .hp-text').textContent = 
            `${Math.max(0, this.battleData.playerHP)}/${playerShip.stats.energy}`;
        document.querySelector('.enemy .hp-text').textContent = 
            `${Math.max(0, this.battleData.enemyHP)}/${enemy.stats.hp}`;
    }

    updateBattleLog(message) {
        const logContent = document.querySelector('.log-content');
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = `[回合 ${this.battleData.turn}] ${message}`;
        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;
    }

    failMission() {
        alert('任务失败！');
        this.playerData.currentMission = null;
        this.playerData.missionProgress = {
            enemiesDefeated: 0,
            itemsCollected: 0,
            exploredAreas: 0
        };
        document.querySelector('.battle-screen').remove();
        this.saveGame();
        this.loadMissions();
    }

    checkMissionComplete() {
        const mission = GAME_DATA.MISSIONS.find(m => m.id === this.playerData.currentMission?.id);
        if (!mission) return false;

        if (mission.type === 'main') {
            return this.playerData.missionProgress.enemiesDefeated >= 3;
        } else {
            return this.playerData.missionProgress.exploredAreas >= 5;
        }
    }

    completeMission() {
        const mission = GAME_DATA.MISSIONS.find(m => m.id === this.playerData.currentMission.id);
        
        // 发放奖励
        if (mission.rewards.gold) {
            this.playerData.gold += mission.rewards.gold;
        }
        if (mission.rewards.exp) {
            // 处理经验值
        }
        if (mission.rewards.materials) {
            if (!this.playerData.inventory) {
                this.playerData.inventory = [];
            }
            this.playerData.inventory.push(...mission.rewards.materials);
        }

        this.playerData.completedMissions.push(mission.id);
        this.playerData.currentMission = null;
        this.playerData.missionProgress = {
            enemiesDefeated: 0,
            itemsCollected: 0,
            exploredAreas: 0
        };

        // 确保移除战斗界面
        const battleScreen = document.querySelector('.battle-screen');
        if (battleScreen) {
            battleScreen.remove();
        }

        alert(`任务完成！获得奖励：${this.formatRewards(mission.rewards)}`);
        
        this.saveGame();
        this.loadMissions();
    }

    abandonMission() {
        if (confirm('确定要放弃当前任务吗？')) {
            this.playerData.currentMission = null;
            this.playerData.missionProgress = {
                enemiesDefeated: 0,
                itemsCollected: 0,
                exploredAreas: 0
            };
            document.querySelector('.battle-screen')?.remove();
            this.saveGame();
            this.loadMissions();
        }
    }

    loadShop() {
        const shopScreen = this.screens['shop'];
        shopScreen.innerHTML = `
            <h2>商店</h2>
            <div class="player-currency">
                <p>金币: ${this.playerData.gold}</p>
                <p>钻石: ${this.playerData.diamond}</p>
            </div>
            <div class="shop-items">
                ${GAME_DATA.SHOP_ITEMS.map(item => `
                    <div class="shop-item">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p class="price">${item.price} ${item.currency}</p>
                        <button onclick="game.purchaseItem('${item.id}')" 
                                ${this.canPurchaseItem(item) ? '' : 'disabled'}>
                            购买
                        </button>
                    </div>
                `).join('')}
            </div>
            <button onclick="game.switchScreen('main-menu')">返回</button>
        `;
    }

    canPurchaseItem(item) {
        const currency = this.playerData[item.currency];
        return currency >= item.price;
    }

    purchaseItem(itemId) {
        const item = GAME_DATA.SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return;

        if (!this.canPurchaseItem(item)) {
            alert(`${item.currency === 'gold' ? '金币' : '钻石'}不足！`);
            return;
        }

        // 扣除货币
        this.playerData[item.currency] -= item.price;

        // 添加到库存
        if (!this.playerData.inventory) {
            this.playerData.inventory = [];
        }
        this.playerData.inventory.push(item);

        alert(`购买成功：${item.name}`);
        this.saveGame();
        this.loadShop();
    }

    loadUpgrade() {
        if (!this.playerData.selectedShip) {
            this.screens['upgrade'].innerHTML = `
                <h2>请先在战舰库中选择一艘战舰</h2>
                <button onclick="game.switchScreen('hangar')">前往战舰库</button>
            `;
            return;
        }

        const ship = this.playerData.spaceships.find(s => s.id === this.playerData.selectedShip);
        
        this.screens['upgrade'].innerHTML = `
            <h2>战舰升级 - ${ship.name}</h2>
            <div class="upgrade-container">
                <div class="ship-stats">
                    <h3>当前属性</h3>
                    <p>等级: ${ship.level}</p>
                    <p>攻击: ${ship.stats.attack}</p>
                    <p>防御: ${ship.stats.defense}</p>
                    <p>速度: ${ship.stats.speed}</p>
                    <p>能量: ${ship.stats.energy}</p>
                </div>
                <div class="upgrade-slots">
                    ${GAME_DATA.UPGRADE_SLOTS.map(slot => this.renderUpgradeSlot(slot, ship)).join('')}
                </div>
                <div class="inventory">
                    <h3>可用装备</h3>
                    ${this.renderInventory()}
                </div>
            </div>
            <button onclick="game.switchScreen('main-menu')">返回</button>
        `;
    }

    renderUpgradeSlot(slot, ship) {
        const level = ship.upgrades?.[slot.id] || 0;
        const price = Math.floor(slot.basePrice * Math.pow(slot.priceIncrease, level));
        const canUpgrade = level < slot.maxLevel && this.playerData.gold >= price;

        return `
            <div class="upgrade-slot">
                <h4>${slot.name}</h4>
                <p>等级: ${level}/${slot.maxLevel}</p>
                <p>升级费用: ${price} 金币</p>
                <button onclick="game.upgradeSlot('${slot.id}')"
                        ${canUpgrade ? '' : 'disabled'}>
                    升级
                </button>
            </div>
        `;
    }

    renderInventory() {
        if (!this.playerData.inventory || this.playerData.inventory.length === 0) {
            return '<p>暂无可用装备</p>';
        }

        return this.playerData.inventory.map(item => `
            <div class="inventory-item">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <button onclick="game.equipItem('${item.id}')">装备</button>
            </div>
        `).join('');
    }

    upgradeSlot(slotId) {
        const ship = this.playerData.spaceships.find(s => s.id === this.playerData.selectedShip);
        const slot = GAME_DATA.UPGRADE_SLOTS.find(s => s.id === slotId);
        
        if (!ship || !slot) return;

        const level = ship.upgrades?.[slotId] || 0;
        if (level >= slot.maxLevel) {
            alert('已达到最高等级！');
            return;
        }

        const price = Math.floor(slot.basePrice * Math.pow(slot.priceIncrease, level));
        if (this.playerData.gold < price) {
            alert('金币不足！');
            return;
        }

        // 扣除金币
        this.playerData.gold -= price;

        // 更新升级等级
        if (!ship.upgrades) ship.upgrades = {};
        ship.upgrades[slotId] = level + 1;

        // 更新战舰属性
        slot.stats.forEach(stat => {
            ship.stats[stat] *= 1.1; // 每级提升10%
        });

        alert(`${slot.name}升级成功！`);
        this.saveGame();
        this.loadUpgrade();
    }

    equipItem(itemId) {
        const ship = this.playerData.spaceships.find(s => s.id === this.playerData.selectedShip);
        const itemIndex = this.playerData.inventory.findIndex(i => i.id === itemId);
        const item = this.playerData.inventory[itemIndex];

        if (!ship || !item) return;

        // 应用装备效果
        const stat = item.effect.stat;
        ship.stats[stat] *= (1 + item.effect.value);

        // 从库存中移除
        this.playerData.inventory.splice(itemIndex, 1);

        alert(`成功装备${item.name}！`);
        this.saveGame();
        this.loadUpgrade();
    }

    loadLeaderboard() {
        this.screens['leaderboard'].innerHTML = `
            <h2>排行榜系统正在开发中...</h2>
            <button onclick="game.switchScreen('main-menu')">返回</button>
        `;
    }

    formatRewards(rewards) {
        return Object.entries(rewards)
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    return `${key}: ${value.join(', ')}`;
                }
                return `${key}: ${value}`;
            })
            .join('<br>');
    }
}

// 创建全局游戏实例
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
}); 