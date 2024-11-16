const SPACESHIPS = [
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
];

const MISSIONS = [
    {
        id: 'main-01',
        title: '前哨站突袭',
        description: '摧毁敌方前哨站，获取情报',
        type: 'main',
        difficulty: 1,
        rewards: { gold: 1000, exp: 100 }
    },
    {
        id: 'side-01',
        title: '遗迹探索',
        description: '探索古代文明遗迹',
        type: 'side',
        difficulty: 2,
        rewards: { gold: 500, materials: ['rare_metal', 'energy_core'] }
    }
];

const SHOP_ITEMS = [
    {
        id: 'item-01',
        name: '高级能量核心',
        description: '提升战舰能量储备20%',
        price: 1000,
        currency: 'gold',
        type: 'upgrade'
    },
    {
        id: 'item-02',
        name: '钛合金装甲',
        description: '提升防御力15%',
        price: 50,
        currency: 'diamond',
        type: 'upgrade'
    }
]; 