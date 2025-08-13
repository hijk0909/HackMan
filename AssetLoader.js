// HackMan/AssetLoader.js
import { GameState } from './js/GameState.js';

export class AssetLoader extends Phaser.Scene {
    constructor() {
        super({ key: 'AssetLoaderScene' });
    }

    preload(){
        // ローディングバーの簡易表示
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 25, width / 2, 50);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 15, (width / 2 - 20) * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
        });

        // 画像
        // 背景
        this.load.image('bg', 'assets/images/bg.png');
        // パネル
        this.load.spritesheet('ss_panel', 'assets/images/ss_panel.png', {
            frameWidth: 100,  frameHeight: 100, endFrame : 15 });
        // 外壁
        this.load.image('wn', 'assets/images/wall_n.png');
        this.load.image('ws', 'assets/images/wall_s.png');
        this.load.image('we', 'assets/images/wall_e.png');
        this.load.image('ww', 'assets/images/wall_w.png');
        this.load.image('wc', 'assets/images/wall_corner.png');
        // カーソル
        this.load.image('cursor', 'assets/images/cursor.png');
        this.load.image('cursor2', 'assets/images/cursor2.png');
        // キャラクター・効果
        this.load.spritesheet('ss_p', 'assets/images/ss_p.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 20 });
        this.load.spritesheet('ss_e1', 'assets/images/ss_e1.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 19 });
        this.load.spritesheet('ss_e2', 'assets/images/ss_e2.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 19 });
        this.load.spritesheet('ss_e3', 'assets/images/ss_e3.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 15 });
        this.load.spritesheet('ss_e4', 'assets/images/ss_e4.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 15 });
        this.load.spritesheet('ss_e5', 'assets/images/ss_e5.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 47 });
        this.load.spritesheet('ss_b1', 'assets/images/ss_b1.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 3 });
        this.load.spritesheet('ss_b2', 'assets/images/ss_b2.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 3 });
        this.load.spritesheet('ss_b3', 'assets/images/ss_b3.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 3 });
        this.load.spritesheet('ss_icon', 'assets/images/ss_icon.png', {
            frameWidth: 48,  frameHeight: 48, endFrame : 71 });
        this.load.spritesheet('ss_expl', 'assets/images/ss_expl.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 15 });
        // UIボタン
        this.load.image('btn_tap', 'assets/images/btn_tap.png');
        // 操作説明
        this.load.image('op_1', 'assets/images/op_1.png');
        this.load.image('op_2', 'assets/images/op_2.png');
        this.load.image('op_3', 'assets/images/op_3.png');
        // クリア画面
        this.load.image('ed_1', 'assets/images/heroine.png');
        this.load.spritesheet('ss_ed_1', 'assets/images/heroine_ss.png' , {
            frameWidth: 180, frameHeight: 60, endFrame : 2});
        // 効果音
        this.load.audio('se_tap', './assets/audio/se/se_tap.mp3');
        this.load.audio('se_key', './assets/audio/se/se_key.mp3');
        this.load.audio('se_exit', './assets/audio/se/se_exit.mp3');
        this.load.audio('se_failed', './assets/audio/se/se_failed.mp3');
        this.load.audio('se_extend', './assets/audio/se/se_extend.mp3');
        this.load.audio('se_explosion', './assets/audio/se/se_explosion.mp3');
        this.load.audio('se_bonus', './assets/audio/se/se_bonus.mp3');
        this.load.audio('se_powerup', './assets/audio/se/se_powerup.mp3');
        // ジングル
        this.load.audio('jingle_round_start', './assets/audio/jingle/jingle_round_start.mp3');
        this.load.audio('jingle_round_clear', './assets/audio/jingle/jingle_round_clear.mp3');
        // BGM
        this.load.audio('bgm_main', './assets/audio/bgm/bgm_main.mp3');
        // データ
        this.load.json('floor_data', './assets/data/floor.json');
    }

    create() {
        GameState.sound = {
            se_tap             : this.sound.add('se_tap', { volume: 1.0 }),
            se_key             : this.sound.add('se_key', { volume: 1.0 }),
            se_exit            : this.sound.add('se_exit', { volume: 1.0 }),
            se_failed          : this.sound.add('se_failed', { volume: 1.0 }),
            se_extend          : this.sound.add('se_extend', { volume: 1.0 }),
            se_explosion       : this.sound.add('se_explosion', { volume: 1.0 }),
            se_bonus           : this.sound.add('se_bonus', { volume: 1.0 }),
            se_powerup         : this.sound.add('se_powerup', { volume: 1.0 }),
            jingle_round_start : this.sound.add('jingle_round_start', { volume: 0.8 }),
            jingle_round_clear : this.sound.add('jingle_round_clear', { volume: 0.8 }),
            bgm_main           : this.sound.add('bgm_main', { volume: 0.6, loop: true })
        };
        this.scene.start('TitleScene');
    }
}