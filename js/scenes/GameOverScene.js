// GameOverScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyInput } from '../utils/InputUtils.js';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        const cx = this.game.canvas.width / 2;
        const cy = this.game.canvas.height / 2;
        this.add.text(cx, 60, 'GAME OVER', { fontSize: '64px', fill: '#ffffff' , stroke: GLOBALS.COLOR.RED, strokeThickness: 2}).setOrigin(0.5,0.5);
        // GameState.sound.jingle_game_over.play();

        const btn_play = this.add.image(cx, cy + 120, 'btn_tap')
        .setOrigin(0.5,0.5)
        .setInteractive()
        .on('pointerdown', () => {this.goto_title();})
        .on('pointerover', () => {btn_play.setTint(0xcccccc);})
        .on('pointerout', () => {btn_play.clearTint();});
    }

    goto_title(){
        // GameState.sound.jingle_game_over.stop();
        GameState.sound.se_tap.play();
        this.scene.start('TitleScene');
    }

}