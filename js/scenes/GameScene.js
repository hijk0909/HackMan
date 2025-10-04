// GameScene.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyInput } from '../utils/InputUtils.js';
import { Exec } from './game_exec.js';
import { Setup } from './game_setup.js';
import { Shockwave } from '../utils/DrawUtils.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // タイトルの停止（念のため)
        // this.scene.stop('TitleScene');

        // 隠しキー
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        this.keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        this.keyU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
        this.keyV = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        // 入力ユーティリティ
        this.my_input = new MyInput(this);
        this.my_input.registerNextAction(() => this.toggle_pause());

        // 実行クラス、セットアップクラス
        this.exec = new Exec(this);
        GameState.setup = new Setup(this);

        // UIの初期化
        this.scene.launch('UIScene');
        GameState.ui = this.scene.get('UIScene');

        // ゲーム状態の初期化
        GameState.state = GLOBALS.GAME.STATE.FLOOR_START;
        GameState.count = GLOBALS.GAME.PERIDO.FLOOR_START;

        // 衝撃波エフェクトの設定
        GameState.shockwave = new Shockwave(this);

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
                GameState.setup.clean_up();
                // フィールドの作成とキャラクターの配置
                GameState.setup.make_field();
                // ワイプイン
                this.wipe_in();
                // UIの設定
                GameState.ui.show_lives();
                GameState.ui.show_floor_start(true);
                GameState.ui.show_floor_clear(false);
                GameState.ui.show_timeover(false);
                GameState.ui.collection_remove(GLOBALS.ITEM.TYPE.KEY);
                GameState.ui.collection_update_speed(false);
                GameState.ui.collection_update_flip(false);
                // [SOUND] ラウンドスタート
                GameState.sound.jingle_round_start.play();
            }
            if (GameState.count < 0 && !GameState.sound.jingle_round_start.isPlaying){
                // ゲーム実行状態に移行
                GameState.state = GLOBALS.GAME.STATE.PLAYING;
                GameState.flip_state = GLOBALS.FLIP_STATE.NONE;
                GameState.ui.show_floor_start(false);
                // [SOUND] メインBGM
                GameState.bgm_play();
            }
        } else if (GameState.state == GLOBALS.GAME.STATE.PLAYING){
            // ◆ゲーム実行
            this.exec.update();
            GameState.setup.update();
            GameState.ui.update();
        } else if (GameState.state == GLOBALS.GAME.STATE.FAILED){
            // ◆ミス
            GameState.count -= 1;
            if (GameState.count < 0){
                GameState.lives -= 1;
                if (GameState.lives < 0){
                    this.scene.stop('UIScene');
                    this.scene.start('GameOverScene');
                } else {
                    GameState.player_speed = Math.max(GameState.player_speed - 1, GLOBALS.PLAYER_SPEED_MIN);
                    GameState.flip_speed = Math.max(GameState.flip_speed - 1, GLOBALS.FLIP_SPEED_MIN);
                    GameState.barrier = 0;
                    GameState.ui.collection_update_barrier(false);
                    GameState.state = GLOBALS.GAME.STATE.FLOOR_START;
                    GameState.count = GLOBALS.GAME.PERIDO.FLOOR_START;
                }
            }
        } else if (GameState.state == GLOBALS.GAME.STATE.FLOOR_CLEAR){
            // ◆ラウンドクリア
            GameState.count -= 1;
            if (GameState.count == GLOBALS.GAME.PERIDO.FLOOR_CLEAR - 1){
                GameState.ui.show_floor_clear(true);
                // [SOUND] 
                GameState.bgm_stop();
                GameState.sound.jingle_round_clear.play();
            } else if (GameState.count < 0 && !GameState.sound.jingle_round_clear.isPlaying){
                GameState.floor += 1;
                if (GameState.floor > GLOBALS.FLOOR_MAX){
                    this.scene.stop('UIScene');
                    this.scene.start('GameClearScene');
                } else {
                    GameState.state = GLOBALS.GAME.STATE.FLOOR_START;
                    GameState.count = GLOBALS.GAME.PERIDO.FLOOR_START;
                }
            } else {
                if (GameState.floor >= GLOBALS.FLOOR_MAX){
                // 最終ステージの場合、残機をスコアに加算
                    this.life_bonus();
                } else {
                // 最終ステージ以外の場合、残り時間をスコアとエネルギーに加算
                    this.time_bonus();
                }
            }
        } else if (GameState.state == GLOBALS.GAME.STATE.PAUSE){
            // ◆一時停止            
        }

        // 衝撃波エフェクト
        GameState.shockwave.update();

        // 隠しキーボード操作
        if (GameState.debug){
            if (Phaser.Input.Keyboard.JustDown(this.keyQ)){
                GameState.bgm_stop();
                this.scene.stop('UIScene');
                this.scene.start('TitleScene');
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyO)){
                GameState.bgm_stop();
                GameState.sound.jingle_round_start.stop();
                GameState.sound.jingle_round_clear.stop();
                GameState.add_score(10000);
                this.scene.stop('UIScene');
                this.scene.start('GameOverScene');
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyS)){
                GameState.player_speed = GameState.player_speed >= GLOBALS.PLAYER_SPEED_MAX ? GLOBALS.PLAYER_SPEED_MIN : GameState.player_speed + 1;
                GameState.ui.collection_update_speed(false);
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyF)){
                GameState.flip_speed = GameState.flip_speed >= GLOBALS.FLIP_SPEED_MAX ? GLOBALS.FLIP_SPEED_MIN : GameState.flip_speed + 1;
                GameState.ui.collection_update_flip(false);
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyB)){
                GameState.barrier = GameState.barrier >= GLOBALS.BARRIER_MAX ? 0 : GameState.barrier + 1;
                GameState.ui.collection_update_barrier(false);
                GameState.player.set_barrier();
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyG)){
                GameState.glove = GameState.glove >= GLOBALS.GLOVE_MAX ? 0 : GameState.glove + 1;
                GameState.ui.collection_update_glove(false);
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyU)){
                GameState.usb = GameState.usb >= GLOBALS.USB_MAX ? 0 : GameState.usb + 1;
                GameState.ui.collection_update_usb(false);
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyV)){
                GameState.visualizer = GameState.visualizer >= GLOBALS.VISUALIZER_MAX ? 0 : GameState.visualizer + 1;
                GameState.ui.collection_update_visualizer(false);
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyE)){
                GameState.add_energy(1000);
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyP)){
                GameState.shockwave.start();
            }
        }
    } // End of update

    // タイムボーナス
    time_bonus(){
        if (GameState.time >= 1000){
            GameState.time -= 1000;
            GameState.add_score(1000);
            GameState.add_energy(100);
        } else if (GameState.time >= 100){
            GameState.time -= 100;
            GameState.add_score(100);
            GameState.add_energy(10);
        } else if (GameState.time >= 10){
            GameState.time -= 10;
            GameState.add_score(10);
            GameState.add_energy(1);
        } else if (GameState.time >= 1){
            GameState.time -= 1;
            GameState.add_score(1);
        }
    }

    // 残機ボーナス
    life_bonus(){
        if (GameState.lives > 0 ){
            GameState.lives -= 1;
            GameState.add_score_without_extend(10000);
        }
        GameState.ui.show_lives();
    }

    // ワイプイン
    wipe_in(){
        // 黒のオーバーレイ
        this.overlay = this.add.rectangle(GameState.field_origin_x, GameState.field_origin_y, GLOBALS.FIELD.WIDTH, GLOBALS.FIELD.HEIGHT, 0x000000, 1)
            .setOrigin(0)
            .setDepth(100);

        // マスク用グラフィクス
        let revealMaskGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        let mask = revealMaskGraphics.createGeometryMask();
        mask.invertAlpha = true;
        this.overlay.setMask(mask);

        // 半径を変えるオブジェクト
        let maskData = { radius: 1 };

        // Tweenで半径を増やす（例：500 → 画面全体に広がる）
        this.tweens.add({
            targets: maskData,
            radius: 500,
            duration: 2000,
            ease: 'Sine.easeOut',
            onUpdate: () => {
                revealMaskGraphics.clear();
                revealMaskGraphics.fillStyle(0xffffff);
                revealMaskGraphics.beginPath();
                revealMaskGraphics.arc(GameState.field_origin_x + GLOBALS.FIELD.WIDTH / 2, GameState.field_origin_y + GLOBALS.FIELD.HEIGHT / 2, maskData.radius, 0, Math.PI * 2);
                revealMaskGraphics.fillPath();
            },
            onComplete: () => {
                if (this.overlay){
                    this.overlay.destroy();  // 演出後はマスクと覆いを削除
                }
            }
        });
    }

    // ポーズ処理
    toggle_pause(){
        if (GameState.state === GLOBALS.GAME.STATE.PLAYING){
            GameState.state = GLOBALS.GAME.STATE.PAUSE;
            GameState.bgm_pause();
            this.children.each(child => {
                if (child.anims && child.anims.isPlaying) child.anims.pause();
            });
            GameState.ui.show_pause(true);
        } else if ( GameState.state === GLOBALS.GAME.STATE.PAUSE){
            GameState.state = GLOBALS.GAME.STATE.PLAYING;
            GameState.bgm_resume();
            this.children.each(child => {
                if (child.anims && child.anims.isPaused) child.anims.resume();
            });
            GameState.ui.show_pause(false);
        }
    }
}