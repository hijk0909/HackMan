// UIScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';

const style1 = { font: '16px Arial', fill: '#ffffff' };
const style2 = { font: '24px Arial', fill: '#ffffff',
                shadow: {offsetX : 2, offsetY: 2, color : '#eee', blur:0, fill: true, stroke: false }};
const style3 = { font: '48px Arial', fill: '#00ff00', stroke: '#008000', strokeThickness: 2,
                shadow: {offsetX : 3, offsetY: 3, color : '#040', blur:0, fill: true, stroke: false }};
const style4 = { font: '48px Arial', fill: '#ff0000', stroke: '#800000', strokeThickness: 2,
                shadow: {offsetX : 3, offsetY: 3, color : '#400', blur:0, fill: true, stroke: false }};

const ROW = 24;
const COLLECTION_SIZE = 32;
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
            this.ui_energy_x = 472;
            this.ui_energy_y = 1;
            this.ui_lives_x = 0;
            this.ui_lives_y = 759;
            this.ui_collections_x = 172;
            this.ui_collections_y = 759;
            this.ui_collections_offset_x = COLLECTION_SIZE * 4;
            this.ui_collections_offset_y = 0;
            this.ui_time_x = 472;
            this.ui_time_y = 751;
            this.ui_floor_start_x = 300;
            this.ui_floor_start_y = 300;
            this.ui_floor_clear_x = 300;
            this.ui_floor_clear_y = 300;
            this.ui_timeover_x = 300;
            this.ui_timeover_y = 300;
        } else {
            this.ui_score_x = 642;
            this.ui_score_y = 96;
            this.ui_highscore_x = 642;
            this.ui_highscore_y = 24;
            this.ui_energy_x = 600;
            this.ui_energy_y = 650;
            this.ui_lives_x = 644;
            this.ui_lives_y = 549;
            this.ui_collections_x = 686;
            this.ui_collections_y = 450;
            this.ui_collections_offset_x = 0;
            this.ui_collections_offset_y = COLLECTION_SIZE;
            this.ui_time_x = 772;
            this.ui_time_y = 650;
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

        this.lives = [];
        for (let i = 0; i < 4 ; i++){
            this.lives[i] = this.add.sprite(this.ui_lives_x + LIVE_SIZE * i, this.ui_lives_y, 'ss_icon')
                .setOrigin(0,0) .setDisplaySize(LIVE_SIZE,LIVE_SIZE) .setFrame(GLOBALS.ITEM.TYPE.LIVE) .setVisible(true);
        }

        this.collections = [];
        for (let i = 0; i < 4 ; i++){
            this.collections[i] = this.add.sprite(this.ui_collections_x + COLLECTION_SIZE * i,
                 this.ui_collections_y, 'ss_icon')
                .setOrigin(0,0) .setDisplaySize(COLLECTION_SIZE, COLLECTION_SIZE) .setFrame(GLOBALS.ITEM.TYPE.NULL) .setVisible(false);
        }
        for (let i = 0; i < 4 ; i++){
            this.collections[i+4] = this.add.sprite(this.ui_collections_x + COLLECTION_SIZE * i + this.ui_collections_offset_x,
                 this.ui_collections_y + this.ui_collections_offset_y, 'ss_icon')
                .setOrigin(0,0) .setDisplaySize(COLLECTION_SIZE, COLLECTION_SIZE) .setFrame(GLOBALS.ITEM.TYPE.NULL) .setVisible(false);
        }

    }

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

    add_collection(type){
        let i = 0;
        this.collections[i].setFrame(type).setVisible(true);
        this.tweens.add({targets: this.collections[i],
            alpha: { from: 0, to: 1 },
            duration: 250,
            repeat: 5,
            onComplete: () => {
                this.collections[i].setFrame(type).setAlpha(1);
                // console.log("add_collection:", i, type);
            }
        });
    }

    check_collection(type){
        for (let i = 0; i < 8; i++){
            // console.log("check_collection:",i, this.collections[i].frame.name);
            if (this.collections[i].frame.name == type){
                return true;
            }
        }
        return false;
    }

    remove_collection(type){
        for (let i = 0; i < 8; i++){
            if (this.collections[i].frame.name == type){
                this.collections[i].setFrame(GLOBALS.ITEM.TYPE.NULL).setVisible(false);
            }
        }
    }

    update(){
        this.ui_score_val.setText(`${GameState.score}`);
        this.ui_highscore_val.setText(`${GameState.high_score}`);
        this.ui_energy_val.setText(`${GameState.energy}`);
        this.ui_time_val.setText(`${GameState.time}`);
        super.update();
    }

}