// UIScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';


const font_family = '"Source Han Code JP", monospace';
const style2 = { fontSize: '24px', fontFamily: font_family, fill: '#ffffff',
                shadow: {offsetX : 2, offsetY: 2, color : '#eee', blur:0, fill: true, stroke: false }};
const style3 = { fontSize: '48px', fontFamily: font_family, fill: '#00ff00', stroke: '#008000', strokeThickness: 2,
                shadow: {offsetX : 3, offsetY: 3, color : '#040', blur:0, fill: true, stroke: false }};
const style4 = { fontSize: '48px', fontFamily: font_family, fill: '#ff0000', stroke: '#800000', strokeThickness: 2,
                shadow: {offsetX : 3, offsetY: 3, color : '#400', blur:0, fill: true, stroke: false }};

const ROW = 24;
const COLLECTION_SIZE = 48;
const COLLECTION_POS_SPEED = 1;
const COLLECTION_POS_FLIP = 2;
const LIVE_SIZE = 32;

export class UIScene extends Phaser.Scene {
    constructor(){
        super({ key: 'UIScene' });
    }

    create() {
        this.cw = this.game.canvas.width;
        this.ch = this.game.canvas.height;
        // console.log("scale,canvas height",this.scale.height, this.game.canvas.height);

        if (GameState.isPortrait){
            this.ui_score_x = 0;
            this.ui_score_y = 1;
            this.ui_highscore_x = 236;
            this.ui_highscore_y = 1;
            this.ui_energy_x = 500;
            this.ui_energy_y = 751;
            this.ui_time_x = 500;
            this.ui_time_y = 1;
            this.ui_lives_x = 0;
            this.ui_lives_y = 759;
            this.ui_collections_x = 156;
            this.ui_collections_y = 751;
            this.ui_collections_offset_x = COLLECTION_SIZE * 3;
            this.ui_collections_offset_y = 0;
            this.ui_floor_start_x = 300;
            this.ui_floor_start_y = 300;
            this.ui_floor_clear_x = 300;
            this.ui_floor_clear_y = 300;
            this.ui_timeover_x = 300;
            this.ui_timeover_y = 300;
        } else {
            this.ui_highscore_x = 642;
            this.ui_highscore_y = 72;
            this.ui_score_x = 642;
            this.ui_score_y = 144;
            this.ui_energy_x = 750;
            this.ui_energy_y = 650;
            this.ui_time_x = 772;
            this.ui_time_y = 1;
            this.ui_lives_x = 644;
            this.ui_lives_y = 549;
            this.ui_collections_x = 653;
            this.ui_collections_y = 418;
            this.ui_collections_offset_x = 0;
            this.ui_collections_offset_y = COLLECTION_SIZE;
            this.ui_floor_start_x = 300;
            this.ui_floor_start_y = 300;
            this.ui_floor_clear_x = 300;
            this.ui_floor_clear_y = 300;
            this.ui_timeover_x = 300;
            this.ui_timeover_y = 300;
        }
        this.ui_score_txt = this.add.text(this.ui_score_x, this.ui_score_y, '1UP', style2);
        this.ui_score_val = this.add.text(this.ui_score_x, this.ui_score_y + ROW, '0', style2);
        this.ui_highscore_txt = this.add.text(this.ui_highscore_x, this.ui_highscore_y, 'HIGH SCORE', style2);
        this.ui_highscore_val = this.add.text(this.ui_highscore_x, this.ui_highscore_y + ROW, '0', style2);
        this.ui_energy_txt = this.add.text(this.ui_energy_x, this.ui_energy_y, 'ENRGY', style2);
        this.ui_energy_val = this.add.text(this.ui_energy_x, this.ui_energy_y + ROW, '0', style2);
        this.ui_time_txt = this.add.text(this.ui_time_x, this.ui_time_y, 'TIME', style2);
        this.ui_time_val = this.add.text(this.ui_time_x, this.ui_time_y + ROW, '0', style2);

        this.ui_floor_start_txt = this.add.text(this.ui_floor_start_x, this.ui_floor_start_y, 'FLOOR : 1', style3).setVisible(false).setOrigin(0.5,0.5);
        this.ui_floor_clear_txt = this.add.text(this.ui_floor_clear_x, this.ui_floor_clear_y, 'FLOOR : 1', style3).setVisible(false).setOrigin(0.5,0.5);
        this.ui_timeover_txt = this.add.text(this.ui_timeover_x, this.ui_timeover_y, 'TIME OVER', style4).setVisible(false).setOrigin(0.5,0.5);

        // 残機表示
        this.lives = [];
        for (let i = 0; i < 4 ; i++){
            this.lives[i] = this.add.sprite(this.ui_lives_x + LIVE_SIZE * i, this.ui_lives_y, 'ss_icon')
                .setOrigin(0,0) .setDisplaySize(LIVE_SIZE,LIVE_SIZE) .setFrame(GLOBALS.ITEM.TYPE.LIVE) .setVisible(true);
        }

        // コレクション表示
        this.collections = [];
        for (let i = 0; i < 3 ; i++){
            this.collections[i] = this.add.sprite(this.ui_collections_x + COLLECTION_SIZE * i,
                 this.ui_collections_y, 'ss_icon')
                .setOrigin(0,0) .setDisplaySize(COLLECTION_SIZE, COLLECTION_SIZE) .setFrame(GLOBALS.ITEM.TYPE.NULL) .setVisible(false);
        }
        for (let i = 0; i < 3 ; i++){
            this.collections[i+3] = this.add.sprite(this.ui_collections_x + COLLECTION_SIZE * i + this.ui_collections_offset_x,
                 this.ui_collections_y + this.ui_collections_offset_y, 'ss_icon')
                .setOrigin(0,0) .setDisplaySize(COLLECTION_SIZE, COLLECTION_SIZE) .setFrame(GLOBALS.ITEM.TYPE.NULL) .setVisible(false);
        }
    }

    // 表示の更新
    update(){
        const score_text = String(GameState.score).padStart(10, ' ');
        this.ui_score_val.setText(score_text);
        const high_score_text = String(GameState.high_score).padStart(10, ' ');
        this.ui_highscore_val.setText(high_score_text);

        // 残りタイムの表示
        let paddedString = String(GameState.time).padStart(5, ' ');
        this.ui_time_val.setText(paddedString);

        // エネルギーの表示
        let formattedValue = (GameState.energy / GLOBALS.FLIP_ENRGY).toFixed(2);
        let [integerPart, decimalPart] = formattedValue.split('.');
        let paddedInteger = integerPart.padStart(3, ' ');
        let finalString = `${paddedInteger}.${decimalPart}`;
        this.ui_energy_val.setText(finalString);

        super.update();
    }

    // 表示制御メソッド
    show_floor_start(visible){
        this.ui_floor_start_txt.setText(`FLOOR: ${GameState.floor}`).setVisible(visible);
    }

    show_floor_clear(visible){
        this.ui_floor_clear_txt.setText(`FLOOR CLEAR`).setVisible(visible);
    }

    show_timeover(visible){
        this.ui_timeover_txt.setText(`TIME OVER`).setVisible(visible);
    }

    show_lives(){
        for (let i = 0; i < 4; i++){
            this.lives[i].setVisible(i<GameState.lives);
        }
    }

    // コレクションの制御メソッド
    // コレクションにアイテムを追加
    collection_add(pos, type){
        this.collections[pos].setFrame(type).setVisible(true);
        this.collection_blink(pos,type);
    }

    // コレクションの点滅→通常状態
    collection_blink(pos, type){
        this.tweens.add({targets: this.collections[pos],
            alpha: { from: 0, to: 1 },
            duration: 250,
            repeat: 5,
            onComplete: () => {
                this.collections[pos].setFrame(type).setAlpha(1);
            }
        });
    }

    // コレクションに特定アイテムがあるかの判定
    collection_check(type){
        for (let i = 0; i < GLOBALS.COLLECTION_MAX; i++){
            // console.log("check_collection:",i, this.collections[i].frame.name);
            if (this.collections[i].frame.name == type){
                return true;
            }
        }
        return false;
    }

    // コレクションから特定アイテムを削除
    collection_remove(type){
        for (let i = 0; i < GLOBALS.COLLECTION_MAX; i++){
            if (this.collections[i].frame.name == type){
                this.collections[i].setFrame(GLOBALS.ITEM.TYPE.NULL).setVisible(false);
            }
        }
    }

    // コレクションのステータス（プレイヤー速度）の更新
    collection_update_speed(blink){
        const type = GLOBALS.ITEM.TYPE.ST_SPEED + GameState.player_speed - GLOBALS.PLAYER_SPEED_MIN;
        this.collections[COLLECTION_POS_SPEED].setFrame(type).setVisible(true);
        if (blink){
            this.collection_blink(COLLECTION_POS_SPEED,type);
        }
    }

    // コレクションのステータス（フリップ速度）の更新
    collection_update_flip(blink){
        const type = GLOBALS.ITEM.TYPE.ST_FLIP + GameState.flip_speed - GLOBALS.FLIP_SPEED_MIN;
        this.collections[COLLECTION_POS_FLIP].setFrame(type).setVisible(true);
        if (blink){
            this.collection_blink(COLLECTION_POS_FLIP,type);
        }
    }
}