// GameState.js
import { GLOBALS } from './GameConst.js';

export const  GameState = {
    ff : 1.0,
    isPortrait : false,
    i_pointer : null,
    i_touch : false,
    i_up : false,
    i_down : false,
    i_left : false,
    i_right : false,
    i_button : false,
    sound : null,
    ui : null,

    // ゲーム情報
    lives : GLOBALS.INIT_LIVES,
    floor : 1,
    score : 0,
    high_score : 0,
    time : GLOBALS.TIME_MAX,
    energy : 1000,
    player_speed : GLOBALS.PLAYER_SPEED_MIN,
    flip_speed : GLOBALS.FLIP_SPEED_MIN,
    barrier : 0,
    ring: 0,
    usb: 0,
    scope: 0,
    state : GLOBALS.GAME.STATE.FLOOR_START,
    count : GLOBALS.GAME.PERIDO.FLOOR_CLEAR,
    flip_state : GLOBALS.FLIP_STATE.NONE,
    item_boxes : [],

    // フィールド
    field_origin_x : 0,
    field_origin_y : 100,
    field_offset_x : 0,
    field_offset_y : 0,
    field_width : GLOBALS.FIELD.WIDTH,
    field_height : GLOBALS.FIELD.HEIGHT,
    field_col : 5,
    field_row : 6,
    panels : [],
    walls : [],
    items : [],

    // キャラクター
    enemies : [],
    bullets : [],
    player : null,
    cursor : null,
    effects : [],

    reset(){
        this.lives = GLOBALS.INIT_LIVES;
        this.floor = 1;
        this.score = 0;
        this.player_speed = GLOBALS.PLAYER_SPEED_MIN;
        this.flip_speed = GLOBALS.FLIP_SPEED_MIN;
        this.barrier = 0;
        this.time = GLOBALS.TIME_MAX;
        this.energy = 1000;
        this.ring = 0;
        this.usb = 0;
        this.scope = 0;
        this.state = GLOBALS.GAME.STATE.FLOOR_START;
        this.count = GLOBALS.GAME.PERIDO.FLOOR_CLEAR;
        this.flip_state = GLOBALS.FLIP_STATE.NONE;
        this.item_boxes = new Array(GLOBALS.FLOOR_MAX + 1).fill(false);
        this.extend = GLOBALS.EXTEND_FIRST;
    },

    add_score(score){
        this.score += score;
        if (this.score > this.high_score){
            this.high_score = this.score;
        }
        if (this.score >= this.extend){
            this.lives += 1;
            this.ui.show_lives();
            this.sound.se_extend.play();
            this.extend += GLOBALS.EXTEND_EVERY;
        }
    },

    add_score_without_extend(score){
        this.score += score;
        if (this.score > this.high_score){
            this.high_score = this.score;
        }        
    },

    add_energy(energy){
        this.energy = Math.max(Math.min(GLOBALS.ENERGY_MAX, this.energy + energy),0);
    },

    add_barrier(barrier){
        this.barrier = Math.max(Math.mix(GLOBALS.BARRIER_MAX, this.barrier + barrier),0);
    }
};