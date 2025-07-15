// GameScene.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyInput } from '../utils/InputUtils.js';
import { Exec } from './game_exec.js';
import { Setup } from './game_setup.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

        // 入力ユーティリティ
        this.my_input = new MyInput(this);
        this.exec = new Exec(this);
        this.setup = new Setup(this);

        // UIの初期化
        this.scene.launch('UIScene');
        GameState.ui = this.scene.get('UIScene');

        // ゲーム状態の初期化
        GameState.state = GLOBALS.GAME.STATE.FLOOR_START;
        GameState.count = GLOBALS.GAME.PERIDO.FLOOR_START;
    } // End of create

    update(time, delta){
        // console.log("time,delta:",time,delta);

        // 入力状態の更新
        this.my_input.update();

        // 実行
        if (GameState.state == GLOBALS.GAME.STATE.FLOOR_START){
            // ◆ラウンドスタート
            GameState.count -= 1;
            if (GameState.count == GLOBALS.GAME.PERIDO.FLOOR_START - 1){
                // 初期化
                this.setup.clean_up();
                // フィールドの作成
                this.setup.make_field();
                // キャラクターの配置
                this.setup.place_characters();
                // タイマーのリセット
                GameState.time = GLOBALS.TIME_MAX;
                // UIの設定
                GameState.ui.show_lives();
                GameState.ui.show_floor_start(true);
                GameState.ui.show_floor_clear(false);
                GameState.ui.show_timeover(false);
                GameState.ui.remove_collection(GLOBALS.ITEM.TYPE.KEY);
            }
            if (GameState.count < 0){
                GameState.state = GLOBALS.GAME.STATE.PLAYING;
                GameState.flip_state = GLOBALS.FLIP_STATE.NONE;
                GameState.ui.show_floor_start(false);
            }
        } else if (GameState.state == GLOBALS.GAME.STATE.PLAYING){
            // ◆ゲーム実行
            this.exec.update();
            GameState.ui.update();
        } else if (GameState.state == GLOBALS.GAME.STATE.FAILED){
            // ◆ミス
            GameState.count -= 1;
            if (GameState.count < 0){
                GameState.lives -= 1;
                if (GameState.lives < 0){
                    // GameState.sound.bgm_main.stop();
                    this.scene.stop('UIScene');
                    this.scene.start('GameOverScene');
                } else {
                    GameState.state = GLOBALS.GAME.STATE.FLOOR_START;
                    GameState.count = GLOBALS.GAME.PERIDO.FLOOR_START;
                }
            }
        } else if (GameState.state == GLOBALS.GAME.STATE.FLOOR_CLEAR){
            // ◆ラウンドクリア
            GameState.count -= 1;
            if (GameState.count == GLOBALS.GAME.PERIDO.FLOOR_CLEAR - 1){
                GameState.ui.show_floor_clear(true);
            } else if (GameState.count < 0){
                GameState.floor += 1;
                if (GameState.floor > GLOBALS.FLOOR_MAX){
                    // GameState.sound.bgm_main.stop();
                    this.scene.stop('UIScene');
                    this.scene.start('GameClearScene');
                } else {
                    GameState.state = GLOBALS.GAME.STATE.FLOOR_START;
                    GameState.count = GLOBALS.GAME.PERIDO.FLOOR_START;
                }
            }
        }

        // 隠しキーボード操作
        if (Phaser.Input.Keyboard.JustDown(this.keyQ)){
            this.scene.start('TitleScene');
        }
    } // End of update
}