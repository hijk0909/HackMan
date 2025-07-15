// TitleScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyInput } from '../utils/InputUtils.js';

const { COLOR } = GLOBALS;

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {

        if (this.game.canvas.width < this.game.canvas.height){
            // 縦画面
            GameState.isPortrait = true;
            GameState.field_origin_x = 0;
            GameState.field_origin_y = 50;
        } else {
            // 横画面
            GameState.isPortrait = false;
            GameState.field_origin_x = 0;
            GameState.field_origin_y = 0;
        }

        this.scene.stop('UIScene'); //念のため

        this.cx = this.game.canvas.width / 2;
        this.cy = this.game.canvas.height / 2;
        this.hy = this.game.canvas.height;
        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        this.my_input = new MyInput(this);
        this.my_input.registerPadConnect(() => this.show_pad());
        if (this.my_input.pad){this.show_pad();}
        this.my_input.registerNextAction(() => this.start_game());

        this.add.text(this.cx, 50, 'HackMan', { fontSize: '64px', fill: '#ffee00' , stroke: COLOR.RED, strokeThickness: 2}).setOrigin(0.5,0.5);
        this.add.text(this.cx, this.hy - 200, 'Copyright ©2025 Current Color Co. Ltd. All rights reserved.', { fontSize: '18px', fill: '#888' }).setOrigin(0.5,0.5);
        this.add.text(this.cx, this.hy - 170, 'Version 0.0 2025.7.15.', { fontSize: '18px', fill: '#888' }).setOrigin(0.5,0.5);
        this.add.text(this.cx, this.hy - 140, 'PUSH SPACE KEY',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5,0.5);

        const btn_play = this.add.image(this.cx, 100, 'btn_tap')
        .setOrigin(0.5,0.5)
        .setInteractive()
        .on('pointerdown', () => {this.start_game();})
        .on('pointerover', () => {btn_play.setTint(0xcccccc);})
        .on('pointerout', () => {btn_play.clearTint();});

        if (GameState.isPortrait){
            this.op1_x = 200;
            this.op1_y = 200;
            this.op2_x = 200;
            this.op2_y = 400;
            this.op3_x = 200;
            this.op3_y = 600;
        } else {
            this.op1_x = 75;
            this.op1_y = 300;
            this.op2_x = 350;
            this.op2_y = 300;
            this.op3_x = 625;
            this.op3_y = 300;
        }
        
        this.add.image(this.op1_x,this.op1_y,'op_1').setOrigin(0,0);
        this.add.image(this.op2_x,this.op2_y,'op_2').setOrigin(0,0);
        this.add.image(this.op3_x,this.op3_y,'op_3').setOrigin(0,0);
    }

    update(time, delta){
        // 隠しキーボード操作
        if (Phaser.Input.Keyboard.JustDown(this.keyC)){
            this.scene.start('GameClearScene');
        }
    }

    show_pad(){
        this.add.text(this.cx, this.hy - 110, ' or PRESS START BUTTON',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
    }

    start_game(){

        // サウンドのアンロック
        this.sound.unlock();

        // 念のため、各シーンを止める
        this.scene.stop('GameScene');
        this.scene.stop('GameOverScene');
        this.scene.stop('GameClearScene');
        this.scene.stop('UI');

        // console.log(this.scene.manager.getScenes(true).map(s => s.scene.key));
        GameState.sound.se_tap.play();

        // ゲーム開始
        GameState.reset();
        this.scene.start('GameScene');
    }

};