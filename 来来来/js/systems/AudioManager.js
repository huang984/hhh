export class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = new Map();
        this.currentMusic = null;
    }

    async loadSound(id, path) {
        const audio = new Audio(path);
        this.sounds.set(id, audio);
    }

    async loadMusic(id, path) {
        const audio = new Audio(path);
        audio.loop = true;
        this.music.set(id, audio);
    }

    playSound(id) {
        const sound = this.sounds.get(id);
        if (sound) {
            sound.currentTime = 0;
            sound.play();
        }
    }

    playMusic(id) {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
        const music = this.music.get(id);
        if (music) {
            music.play();
            this.currentMusic = music;
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
    }
} 