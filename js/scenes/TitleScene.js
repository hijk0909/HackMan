// TitleScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyInput } from '../utils/InputUtils.js';

const { COLOR } = GLOBALS;
const KEY_AUTO_REPEAT = 60;

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
        this.start_floor = 1;
        this.keyA_cnt = 0;
        this.keyS_cnt = 0;
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
        this.start_floor = 1;

        // 座標変数
        this.cx = this.game.canvas.width / 2;
        this.cy = this.game.canvas.height / 2;
        this.hy = this.game.canvas.height;

        // 隠しキー操作
        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.my_input = new MyInput(this);
        this.my_input.registerPadConnect(() => this.show_pad());
        if (this.my_input.pad){this.show_pad();}
        this.my_input.registerNextAction(() => this.start_game());

        this.add.text(this.cx, 50, 'HackMan', { fontSize: '64px', fill: '#ffee00' , stroke: COLOR.RED, strokeThickness: 2}).setOrigin(0.5,0.5);
        this.add.text(this.cx, this.hy - 150, 'Copyright Current Color Co. Ltd. All rights reserved.', { fontSize: '18px', fill: '#888' }).setOrigin(0.5,0.5);
        this.add.text(this.cx, this.hy - 120, 'Version 0.2 2025.8.3.', { fontSize: '18px', fill: '#888' }).setOrigin(0.5,0.5);
        this.add.text(this.cx, this.hy - 90, 'PUSH SPACE KEY',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5,0.5);
        this.start_floor_txt = this.add.text(this.cx, 150, 'Start Floor: ', { fontSize: '24px', fill: '#eee' }).setOrigin(0.5,0.5).setVisible(false);

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
            this.op2_y = 350;
            this.op3_x = 200;
            this.op3_y = 500;
        } else {
            this.op1_x = 100;
            this.op1_y = 300;
            this.op2_x = 325;
            this.op2_y = 300;
            this.op3_x = 550;
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
        if (this.keyA.isDown){
            this.keyA_cnt += 1;
            if (this.keyA_cnt === 1 || this.keyA_cnt >= KEY_AUTO_REPEAT){
                if (this.start_floor > 1){
                    this.start_floor -= 1;
                    this.start_floor_txt.setText(`START FLOOR : ${this.start_floor}`).setVisible(true);
                }
            }
        } else {
            this.keyA_cnt = 0;
        }
        if (this.keyS.isDown){
            this.keyS_cnt += 1;
            if (this.keyS_cnt === 1 || this.keyS_cnt > KEY_AUTO_REPEAT){
                if (this.start_floor < GLOBALS.FLOOR_MAX){
                    this.start_floor += 1;
                    this.start_floor_txt.setText(`START FLOOR : ${this.start_floor}`).setVisible(true);
                }
            }
        } else {
            this.keyS_cnt = 0;
        }
    }

    show_pad(){
        this.add.text(this.cx, this.hy - 60, ' or PRESS START BUTTON',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
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
        GameState.floor = this.start_floor;
        this.scene.start('GameScene');
    }

};