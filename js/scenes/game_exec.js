// game_exec.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { unlock_item_box } from './game_item_box_checkers.js';

export class Exec {
    constructor(scene) {
        this.scene = scene;
    }

    update(){
        // カーソルの更新
        GameState.cursor.update();

        // プレイヤーの更新
        GameState.player.update();

        // アイテムの出現条件のチェック
        unlock_item_box();

        // パネルの更新
        for (let i=0; i<GLOBALS.FIELD.COL; i++){
            for (let j=0; j<GLOBALS.FIELD.ROW; j++){
                GameState.panels[i][j].update();
            }
        }

        // 時間の更新
        GameState.time -= 1;
        if (GameState.time <= 0){
            GameState.state = GLOBALS.GAME.STATE.FAILED;
            GameState.count = GLOBALS.GAME.PERIDO.FAILED;
            GameState.ui.show_timeover(true);
            GameState.sound.bgm_main.stop();
            GameState.player.stop_animation();
        }

        // 敵の管理 と プレイヤーとの当たり判定
        for (let i = GameState.enemies.length - 1; i >= 0; i--) {
            const e = GameState.enemies[i];
            e.update();
            if (!e.isAlive()) {
                e.destroy();
                GameState.enemies.splice(i, 1);
                // 敵が全滅したら、鍵と出口を可視化
                if (GameState.enemies.length === 0){
                    for (let j = 0 ; j < GameState.items.length; j++){
                        if (GameState.items[j].type === GLOBALS.ITEM.TYPE.KEY ||
                            GameState.items[j].type === GLOBALS.ITEM.TYPE.EXIT ){
                            GameState.items[j].set_visible(true);
                        }
                    }
                }
                continue;
            }
            if (MyMath.isHittingCharacter(e.pos,e.size,GameState.player.pos,GameState.player.size)){
                GameState.state = GLOBALS.GAME.STATE.FAILED;
                GameState.count = GLOBALS.GAME.PERIDO.FAILED;
                GameState.sound.bgm_main.stop();
                GameState.sound.se_failed.play();
                GameState.player.stop_animation();
                break;
            }
        }

        // 弾の管理 と プレイヤーとの当たり判定
        for (let i = GameState.bullets.length - 1; i >= 0; i--) {
            const b = GameState.bullets[i];
            b.update();
            if (!b.isAlive()) {
                b.destroy();
                GameState.bullets.splice(i, 1);
                continue;
            }
            if (MyMath.isHittingCharacter(b.pos,b.size,GameState.player.pos,GameState.player.size)){
                GameState.state = GLOBALS.GAME.STATE.FAILED;
                GameState.count = GLOBALS.GAME.PERIDO.FAILED;
                GameState.sound.bgm_main.stop();
                GameState.sound.se_failed.play();
                GameState.player.stop_animation();
                break;
            }
        }

        // 画面効果の管理
        for (let i = GameState.effects.length - 1; i >= 0; i--) {
            const e = GameState.effects[i];
            e.update();
            if (!e.isAlive()) {
                e.destroy();
                GameState.effects.splice(i, 1);
                continue;
            }
        }

        // 外壁の色の変更
        let c;
        if (GameState.flip_state === GLOBALS.FLIP_STATE.NONE){
           if (GameState.energy >= GLOBALS.FLIP_ENRGY){
                c = GLOBALS.COLOR.WALL_NORMAL;
            } else {
                c = GLOBALS.COLOR.PANEL_SHORT;
            }
        } else if (GameState.flip_state === GLOBALS.FLIP_STATE.READY){
           if (GameState.energy >= GLOBALS.FLIP_ENRGY){
                c = GLOBALS.COLOR.WALL_READY;
            } else {
                c = GLOBALS.COLOR.PANEL_SHORT;
            }
        } else if (GameState.flip_state === GLOBALS.FLIP_STATE.FLIP){
            c = GLOBALS.COLOR.WALL_FLIP;
        }
        for (let i=0; i < GLOBALS.FIELD.ROW*2 + GLOBALS.FIELD.COL*2 + 4;i++){
            GameState.walls[i].sprite.setTint(c);
        }

    } // End of update
}