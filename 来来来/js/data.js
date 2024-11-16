// 游戏数据
const GAME_DATA = {
    SPACESHIPS: [
        {
            id: 'shark-01',
            name: '深海猎手',
            type: 'shark',
            description: '像鲨鱼一样凶猛的战舰',
            baseStats: { attack: 12, defense: 10, speed: 6 }
        },
        {
            id: 'bird-01',
            name: '天际飞鸟',
            type: 'bird',
            description: '高速灵活的战斗舰',
            baseStats: { attack: 8, defense: 6, speed: 12 }
        }
    ],
    
    MISSIONS: [
        {
            id: 'main-01',
            title: '前哨站突袭',
            description: '摧毁敌方前哨站，获取情报',
            type: 'main',
            difficulty: 1,
            rewards: { gold: 1000, exp: 100 }
        },
        {
            id: 'main-02',
            title: '深空追击',
            description: '追踪并消灭逃逸的敌方指挥舰',
            type: 'main',
            difficulty: 2,
            rewards: { gold: 2000, exp: 200, diamond: 10 }
        },
        {
            id: 'main-03',
            title: '能源危机',
            description: '保护能源运输舰队免受海盗袭击',
            type: 'main',
            difficulty: 3,
            rewards: { gold: 3000, exp: 300, diamond: 20 }
        },
        {
            id: 'side-01',
            title: '遗迹探索',
            description: '探索古代文明遗迹',
            type: 'side',
            difficulty: 2,
            rewards: { gold: 500, materials: ['rare_metal', 'energy_core'] }
        },
        {
            id: 'side-02',
            title: '太空救援',
            description: '营救遇险的商业飞船',
            type: 'side',
            difficulty: 1,
            rewards: { gold: 800, materials: ['shield_module'] }
        },
        {
            id: 'side-03',
            title: '陨石带清理',
            description: '清理航道中的危险陨石',
            type: 'side',
            difficulty: 2,
            rewards: { gold: 1200, materials: ['mineral_crystal'] }
        },
        {
            id: 'side-04',
            title: '星际考古',
            description: '调查神秘的太空遗迹信号',
            type: 'side',
            difficulty: 3,
            rewards: { gold: 1500, materials: ['ancient_core', 'tech_fragment'] }
        }
    ],
    
    SHOP_ITEMS: [
        {
            id: 'core-01',
            name: '基础能量核心',
            description: '提升战舰能量储备10%',
            price: 500,
            currency: 'gold',
            type: 'upgrade',
            effect: {
                stat: 'energy',
                value: 0.1
            }
        },
        {
            id: 'core-02',
            name: '高级能量核心',
            description: '提升战舰能量储备20%',
            price: 1000,
            currency: 'gold',
            type: 'upgrade',
            effect: {
                stat: 'energy',
                value: 0.2
            }
        },
        {
            id: 'armor-01',
            name: '钛合金装甲',
            description: '提升防御力15%',
            price: 50,
            currency: 'diamond',
            type: 'upgrade',
            effect: {
                stat: 'defense',
                value: 0.15
            }
        },
        {
            id: 'weapon-01',
            name: '离子加速器',
            description: '提升攻击力12%',
            price: 800,
            currency: 'gold',
            type: 'upgrade',
            effect: {
                stat: 'attack',
                value: 0.12
            }
        }
    ],

    UPGRADE_SLOTS: [
        {
            id: 'weapon',
            name: '武器系统',
            maxLevel: 5,
            basePrice: 500,
            priceIncrease: 1.5,
            stats: ['attack']
        },
        {
            id: 'shield',
            name: '护盾系统',
            maxLevel: 5,
            basePrice: 400,
            priceIncrease: 1.4,
            stats: ['defense']
        },
        {
            id: 'engine',
            name: '引擎系统',
            maxLevel: 5,
            basePrice: 300,
            priceIncrease: 1.3,
            stats: ['speed']
        },
        {
            id: 'core',
            name: '能量核心',
            maxLevel: 5,
            basePrice: 600,
            priceIncrease: 1.6,
            stats: ['energy']
        }
    ],

    ENEMIES: {
        'main-01': {
            name: '前哨站哨兵',
            stats: {
                hp: 150,
                attack: 15,
                defense: 8,
                speed: 5
            },
            rewards: {
                exp: 50,
                gold: 200
            }
        },
        'main-02': {
            name: '敌方指挥舰',
            stats: {
                hp: 200,
                attack: 20,
                defense: 12,
                speed: 8
            },
            rewards: {
                exp: 100,
                gold: 400
            }
        },
        'main-03': {
            name: '海盗旗舰',
            stats: {
                hp: 300,
                attack: 25,
                defense: 15,
                speed: 6
            },
            rewards: {
                exp: 150,
                gold: 600
            }
        },
        'side-01': {
            name: '遗迹守卫',
            stats: {
                hp: 100,
                attack: 12,
                defense: 5,
                speed: 8
            },
            rewards: {
                exp: 30,
                gold: 150
            }
        },
        'side-02': {
            name: '太空海盗',
            stats: {
                hp: 80,
                attack: 10,
                defense: 4,
                speed: 10
            },
            rewards: {
                exp: 25,
                gold: 120
            }
        },
        'side-03': {
            name: '自动防御系统',
            stats: {
                hp: 120,
                attack: 14,
                defense: 6,
                speed: 7
            },
            rewards: {
                exp: 35,
                gold: 180
            }
        },
        'side-04': {
            name: '远古守护者',
            stats: {
                hp: 250,
                attack: 22,
                defense: 14,
                speed: 4
            },
            rewards: {
                exp: 120,
                gold: 500
            }
        }
    }
}; 