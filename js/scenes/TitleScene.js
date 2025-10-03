// TitleScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyInput } from '../utils/InputUtils.js';
import { Ranking } from './ranking.js';

const { COLOR } = GLOBALS;
const KEY_AUTO_REPEAT = 60;

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
        this.start_floor = 1;
        this.keyF_cnt = 0;
        this.keyG_cnt = 0;
        this.ranking = null;
        this.attract_timer = null;
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
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);

        this.my_input = new MyInput(this);
        this.my_input.registerPadConnect(() => this.show_pad());
        if (this.my_input.pad){this.show_pad();}
        this.my_input.registerNextAction(() => this.start_game());

        // this.add.text(this.cx, 50, 'HackMan', { fontSize: '64px', fill: '#ffee00' , stroke: COLOR.RED, strokeThickness: 2}).setOrigin(0.5,0.5);
        this.logo = this.add.image(this.cx, 0, 'logo').setOrigin(0.5,0).setDepth(0);
        this.add.text(this.cx, this.hy - 185, 'Copyright Current Color Co. Ltd. All rights reserved.', { fontSize: '18px', fill: '#888' }).setOrigin(0.5,0.5);
        this.add.text(this.cx, this.hy - 155, `Version ${GLOBALS.VERSION} ${GLOBALS.DATE}`, { fontSize: '18px', fill: '#888' }).setOrigin(0.5,0.5);
        this.add.text(this.cx, this.hy - 125, 'PUSH SPACE KEY',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5,0.5);
        this.start_floor_txt = this.add.text(this.cx, 210, 'Start Floor: ', { fontSize: '24px', fill: '#eee' }).setOrigin(0.5,0.5).setVisible(false);

        const btn_play = this.add.image(this.cx, this.hy - 10, 'btn_tap')
        .setOrigin(0.5,1)
        .setInteractive()
        .on('pointerdown', () => {this.start_game();})
        .on('pointerover', () => {btn_play.setTint(0xcccccc);})
        .on('pointerout', () => {btn_play.clearTint();});

        if (GameState.isPortrait){
            this.op1_x = 200;
            this.op1_y = 230;
            this.op2_x = 200;
            this.op2_y = 350;
            this.op3_x = 200;
            this.op3_y = 470;
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

        //ランキング取得（インターネット経由）
        if (this.ranking === null){
            this.ranking = new Ranking(this);
        }
        this.ranking.get_net_ranking();

        this.reset_attract_timer();

        // タイトルロゴを波状に揺らす
        this.ripple = this.renderer.pipelines.get('Ripple');
        this.ripple.set1f('time', 0);
        this.ripple.set1f('frequency', 20.0);
        this.ripple.set1f('amplitude', 0.004);
        this.logo.setPipeline('Ripple');
    }

    reset_attract_timer(){
        // 既存のイベントを止める
        if (this.attract_timer) {
            this.attract_timer.remove(false);
        }

        // 新しく10秒タイマーを作成
        this.attract_timer = this.time.addEvent({
            delay: 10000,
            callback: () => {
                this.scene.start('AttractScene');
            },
            callbackScope: this
        });
    }

    update(time, delta){

        // タイトルを波状に揺らす
        this.ripple.set1f('time', time * 0.002);

        // 隠しキーボード操作
        if (GameState.debug){
            if (Phaser.Input.Keyboard.JustDown(this.keyA)){
                this.scene.start('AttractScene');
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyC)){
                this.scene.start('GameClearScene');
            }
            if (this.keyF.isDown){
                this.reset_attract_timer();
                this.keyF_cnt += 1;
                if (this.keyF_cnt === 1 || this.keyF_cnt >= KEY_AUTO_REPEAT){
                    if (this.start_floor > 1){
                        this.start_floor -= 1;
                        this.start_floor_txt.setText(`START FLOOR : ${this.start_floor}`).setVisible(true);
                    }
                }
            } else {
                this.keyF_cnt = 0;
            }
            if (this.keyG.isDown){
                this.reset_attract_timer();
                this.keyG_cnt += 1;
                if (this.keyG_cnt === 1 || this.keyG_cnt > KEY_AUTO_REPEAT){
                    if (this.start_floor < GLOBALS.FLOOR_MAX){
                        this.start_floor += 1;
                        this.start_floor_txt.setText(`START FLOOR : ${this.start_floor}`).setVisible(true);
                    }
                }
            } else {
                this.keyG_cnt = 0;
            }
        }
    }

    show_pad(){
        this.add.text(this.cx, this.hy - 100, ' or PRESS START BUTTON',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
    }

    start_game(){

        // サウンドのアンロック
        this.sound.unlock();

        // 念のため、各シーンを止める
        // this.scene.stop('GameScene');
        // this.scene.stop('GameOverScene');
        // this.scene.stop('GameClearScene');
        // this.scene.stop('UI');

        // console.log(this.scene.manager.getScenes(true).map(s => s.scene.key));
        GameState.sound.se_tap.play();

        // ゲーム開始
        GameState.reset();
        GameState.floor = this.start_floor;
        this.scene.start('GameScene');
    }
}