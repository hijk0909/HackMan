// UIScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { get_box_hint } from './game_item_box_checkers.js';
import { get_box_item } from './game_item_box_checkers.js';

const font_family = '"Source Han Code JP", monospace';
const style2 = { fontSize: '24px', fontFamily: font_family, fill: '#ffffff',
                shadow: {offsetX : 2, offsetY: 2, color : '#eee', blur:0, fill: true, stroke: false }};
const style3 = { fontSize: '48px', fontFamily: font_family, fill: '#00ff00',
                stroke: '#006000', strokeThickness: 3,
                shadow: {offsetX : 3, offsetY: 3, color : '#040', blur:0, fill: true, stroke: false }};
const style4 = { fontSize: '48px', fontFamily: font_family, fill: '#ff0000',
                stroke: '#800000', strokeThickness: 2,
                shadow: {offsetX : 3, offsetY: 3, color : '#400', blur:0, fill: true, stroke: false }};
const style5 = { fontSize: '24px', fontFamily: font_family, fill: '#ffd0d0', 
                stroke: '#402020', strokeThickness: 3,
                align : 'center',};

const ROW = 24;
const COLLECTION_SIZE = 48;
const LIVE_SIZE = 20;
const LIVES_DISP_MAX = 5;

const COLLECTION_POS = {
    KEY : 0,
    TEMP : 1,
    RING : 2,
    USB : 3,
    SCOPE : 4,
    SPEED : 5,
    FLIP : 6,
    BARRIER : 7
}

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
            this.ui_energy_x = 518;
            this.ui_energy_y = 751;
            this.ui_time_x = 500;
            this.ui_time_y = 1;
            this.ui_lives_x = 0;
            this.ui_lives_y = 765;
            this.ui_collections_x = 122;
            this.ui_collections_y = 751;
            this.ui_collections_offset_x = COLLECTION_SIZE * 4;
            this.ui_collections_offset_y = 0;
            this.ui_floor_start_x = 300;
            this.ui_floor_start_y = 300;
            this.ui_floor_hint_x = 300;
            this.ui_floor_hint_y = 605;
            this.ui_floor_item_x = 300;
            this.ui_floor_item_y = 675;
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
            this.ui_floor_hint_x = 300;
            this.ui_floor_hint_y = 605;
            this.ui_floor_item_x = 300;
            this.ui_floor_item_y = 675;
            this.ui_floor_clear_x = 300;
            this.ui_floor_clear_y = 300;
            this.ui_timeover_x = 300;
            this.ui_timeover_y = 300;
        }
        this.ui_score_txt = this.add.text(this.ui_score_x, this.ui_score_y, '1UP', style2);
        this.ui_score_val = this.add.text(this.ui_score_x, this.ui_score_y + ROW, '0', style2);
        this.ui_highscore_txt = this.add.text(this.ui_highscore_x, this.ui_highscore_y, 'HIGH SCORE', style2);
        this.ui_highscore_val = this.add.text(this.ui_highscore_x, this.ui_highscore_y + ROW, '0', style2);
        this.ui_energy_txt = this.add.text(this.ui_energy_x, this.ui_energy_y, 'ENERGY', style2);
        this.ui_energy_val = this.add.text(this.ui_energy_x, this.ui_energy_y + ROW, '0', style2);
        this.ui_time_txt = this.add.text(this.ui_time_x, this.ui_time_y, 'TIME', style2);
        this.ui_time_val = this.add.text(this.ui_time_x, this.ui_time_y + ROW, '0', style2);

        this.ui_floor_start_txt = this.add.text(this.ui_floor_start_x, this.ui_floor_start_y, 'FLOOR : 1', style3).setVisible(false).setOrigin(0.5,0.5);
        this.ui_floor_hint = this.add.text(this.ui_floor_hint_x, this.ui_floor_hint_y, 'HINT', style5).setVisible(false).setOrigin(0.5,0);
        this.ui_floor_item = this.add.text(this.ui_floor_item_x, this.ui_floor_item_y, 'ITEM', style5).setVisible(false).setOrigin(0.5,0);
        this.ui_floor_clear_txt = this.add.text(this.ui_floor_clear_x, this.ui_floor_clear_y, 'FLOOR : 1', style3).setVisible(false).setOrigin(0.5,0.5);
        this.ui_timeover_txt = this.add.text(this.ui_timeover_x, this.ui_timeover_y, 'TIME OVER', style4).setVisible(false).setOrigin(0.5,0.5);

        // 残機表示
        this.lives = [];
        for (let i = 0; i < LIVES_DISP_MAX ; i++){
            this.lives[i] = this.add.sprite(this.ui_lives_x + LIVE_SIZE * i, this.ui_lives_y, 'ss_icon')
                .setOrigin(0,0) .setDisplaySize(LIVE_SIZE,LIVE_SIZE) .setFrame(GLOBALS.ITEM.TYPE.LIVE) .setVisible(true);
        }

        // コレクション表示
        this.collections = [];
        for (let i = 0; i < GLOBALS.COLLECTION_MAX / 2 ; i++){
            this.collections[i] = this.add.sprite(this.ui_collections_x + COLLECTION_SIZE * i,
                 this.ui_collections_y, 'ss_icon')
                .setOrigin(0,0) .setDisplaySize(COLLECTION_SIZE, COLLECTION_SIZE) .setFrame(GLOBALS.ITEM.TYPE.NULL) .setVisible(false);
        }
        for (let i = 0; i < GLOBALS.COLLECTION_MAX / 2 ; i++){
            this.collections[i + GLOBALS.COLLECTION_MAX / 2] = this.add.sprite(this.ui_collections_x + COLLECTION_SIZE * i + this.ui_collections_offset_x,
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

    // スタート文字表示（ヒント表示、アイテム表示）
    show_floor_start(visible){
        this.ui_floor_start_txt.setText(`FLOOR: ${GameState.floor}`).setVisible(visible);
        this.ui_floor_hint.setText(`HINT:\n${get_box_hint()}`).setVisible(visible);
        this.ui_floor_item.setText(`ITEM:\n${get_box_item()}`).setVisible(visible);
    }

    // クリア文字表示
    show_floor_clear(visible){
        this.ui_floor_clear_txt.setText(`FLOOR CLEAR`).setVisible(visible);
    }

    // タイムオーバー文字表示
    show_timeover(visible){
        this.ui_timeover_txt.setText(`TIME OVER`).setVisible(visible);
    }

    // 残機表示
    show_lives(){
        for (let i = 0; i < LIVES_DISP_MAX ; i++){
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

    // 個別アイテムの追加・更新
    collection_add_key(){
        this.collection_add(COLLECTION_POS.KEY, GLOBALS.ITEM.TYPE.KEY);
    }

    // コレクションのステータス更新
    // ◆プレイヤー速度
    collection_update_speed(blink){
        const type = GLOBALS.ITEM.TYPE.ST_SPEED + GameState.player_speed - GLOBALS.PLAYER_SPEED_MIN;
        this.collections[COLLECTION_POS.SPEED].setFrame(type).setVisible(true);
        if (blink){
            this.collection_blink(COLLECTION_POS.SPEED,type);
        }
    }

    // ◆フリップ速度
    collection_update_flip(blink){
        const type = GLOBALS.ITEM.TYPE.ST_FLIP + GameState.flip_speed - GLOBALS.FLIP_SPEED_MIN;
        this.collections[COLLECTION_POS.FLIP].setFrame(type).setVisible(true);
        if (blink){
            this.collection_blink(COLLECTION_POS.FLIP,type);
        }
    }

    // ◆バリア
    collection_update_barrier(blink){
        if (GameState.barrier === 0){
            this.collections[COLLECTION_POS.BARRIER].setVisible(false);
        } else {
            const type = GLOBALS.ITEM.TYPE.ST_BARRIER + GameState.barrier - 1;
            this.collections[COLLECTION_POS.BARRIER].setFrame(type).setVisible(true);
            if (blink){
                this.collection_blink(COLLECTION_POS.BARRIER,type);
            }
        }
    }

    // ◆リング
    collection_update_ring(blink){
        if (GameState.ring === 0){
            this.collections[COLLECTION_POS.RING].setVisible(false);
        } else {
            const type = GLOBALS.ITEM.TYPE.ST_RING + GameState.ring - 1;
            this.collections[COLLECTION_POS.RING].setFrame(type).setVisible(true);
            if (blink){
                this.collection_blink(COLLECTION_POS.RING,type);
            }
        }
    }

    // ◆ＵＳＢ
    collection_update_usb(blink){
        if (GameState.usb === 0){
            this.collections[COLLECTION_POS.USB].setVisible(false);
        } else {
            const type = GLOBALS.ITEM.TYPE.ST_USB + GameState.usb - 1;
            this.collections[COLLECTION_POS.USB].setFrame(type).setVisible(true);
            if (blink){
                this.collection_blink(COLLECTION_POS.USB,type);
            }
        }
    }

    // ◆スコープ
    collection_update_scope(blink){
        if (GameState.scope === 0){
            this.collections[COLLECTION_POS.SCOPE].setVisible(false);
        } else {
            const type = GLOBALS.ITEM.TYPE.ST_SCOPE + GameState.scope - 1;
            this.collections[COLLECTION_POS.SCOPE].setFrame(type).setVisible(true);
            if (blink){
                this.collection_blink(COLLECTION_POS.SCOPE,type);
            }
        }
    }
}