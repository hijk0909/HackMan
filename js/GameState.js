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
    lives : 4,
    floor : 1,
    player_speed : 3,
    flip_speed : 2,
    time : GLOBALS.TIME_MAX,
    energy : 100,
    score : 0,
    high_score : 0,
    state : GLOBALS.GAME.STATE.FLOOR_START,
    count : GLOBALS.GAME.PERIDO.FLOOR_CLEAR,
    flip_state : GLOBALS.FLIP_STATE.NONE,

    // フィールド
    field_origin_x : 0,
    field_origin_y : 100,
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
        this.lives = 4;
        this.floor = 1;
        this.plaeyr_speed = 4;
        this.flip_speed = 3; 
        this.time = GLOBALS.TIME_MAX;
        this.energy = 100;
        this.state = GLOBALS.GAME.STATE.FLOOR_START;
        this.count = GLOBALS.GAME.PERIDO.FLOOR_CLEAR;
        this.flip_state = GLOBALS.FLIP_STATE.NONE;
        this.score = 0;
        this.high_score = 0;
    }
};