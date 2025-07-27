// GameClearScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyInput } from '../utils/InputUtils.js';

export class GameClearScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameClearScene' });
    }

    create() {
        this.cx = this.game.canvas.width / 2;
        this.cy = this.game.canvas.height / 2;
        this.add.text(this.cx, 60, 'GAME CLEAR', { fontSize: '64px', fill: '#ffffff' , stroke: GLOBALS.COLOR.RED, strokeThickness: 2}).setOrigin(0.5,0.5);
        this.add.text(this.cx, this.cy + 120, 'PUSH SPACE KEY',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5,0.5);

        this.my_input = new MyInput(this);
        this.my_input.registerPadConnect(() => this.show_pad());
        if (this.my_input.pad){this.show_pad();}
        this.my_input.registerNextAction(() => this.goto_title());

        const btn_play = this.add.image(this.cx, this.cy, 'btn_tap')
        .setOrigin(0.5,0.5)
        .setInteractive()
        .on('pointerdown', () => {this.goto_title();})
        .on('pointerover', () => {btn_play.setTint(0xcccccc);})
        .on('pointerout', () => {btn_play.clearTint();});
    }

    show_pad(){
        this.add.text(this.cx, this.cy + 140, ' or PRESS START BUTTON',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
    }

    goto_title(){
        // GameState.sound.bgm_clear.stop();
        GameState.sound.se_tap.play();
        this.scene.start('TitleScene');
    }

    update(time, delta){
    }

}