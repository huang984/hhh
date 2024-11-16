export class SaveSystem {
    static save(gameData) {
        try {
            const saveData = {
                playerData: gameData,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('spaceshipGame', JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('保存游戏失败:', error);
            return false;
        }
    }

    static load() {
        try {
            const saveData = localStorage.getItem('spaceshipGame');
            if (saveData) {
                return JSON.parse(saveData).playerData;
            }
            return null;
        } catch (error) {
            console.error('加载存档失败:', error);
            return null;
        }
    }

    static deleteSave() {
        try {
            localStorage.removeItem('spaceshipGame');
            return true;
        } catch (error) {
            console.error('删除存档失败:', error);
            return false;
        }
    }
} 