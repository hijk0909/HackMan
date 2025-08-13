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
        for (let i=0; i<GameState.field_col; i++){
            for (let j=0; j<GameState.field_row; j++){
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
                // スコープの効果：敵の数に応じてアイテムを表示
                this.activate_scope();
                continue;
            }
            if (MyMath.isHittingCharacter(e.pos,e.size,GameState.player.pos,GameState.player.size)){
                // 敵とプレイヤーの衝突
                GameState.state = GLOBALS.GAME.STATE.FAILED;
                GameState.count = GLOBALS.GAME.PERIDO.FAILED;
                GameState.sound.bgm_main.stop();
                GameState.sound.se_failed.play();
                GameState.player.stop_animation();
                break;
            }
        }

        // 敵弾の管理 と プレイヤーとの当たり判定
        for (let i = GameState.bullets.length - 1; i >= 0; i--) {
            const b = GameState.bullets[i];
            b.update();
            if (!b.isAlive()) {
                b.destroy();
                GameState.bullets.splice(i, 1);
                continue;
            }
            if (MyMath.isHittingCharacter(b.pos,b.size,GameState.player.pos,GameState.player.size)){
                b.setAlive(false);
                if (GameState.barrier > 0){
                    GameState.barrier -= 1;
                    GameState.sound.se_failed.play();
                    if (GameState.barrier == 0){
                        GameState.player.set_barrier(false);
                    }
                    GameState.ui.collection_update_barrier(true);
                } else {
                    GameState.state = GLOBALS.GAME.STATE.FAILED;
                    GameState.count = GLOBALS.GAME.PERIDO.FAILED;
                    GameState.sound.bgm_main.stop();
                    GameState.sound.se_failed.play();
                    GameState.player.stop_animation();
                    GameState.ui.collection_update_barrier(false);
                }
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
        for (let i=0; i < GameState.field_row*2 + GameState.field_col*2 + 4;i++){
            GameState.walls[i].sprite.setTint(c);
        }

    } // End of update

    activate_scope(){
        if (GameState.scope >= 1 && GameState.enemies.length <= 1){
            this.set_item_visible(GLOBALS.ITEM.TYPE.KEY);
        }
        if (GameState.scope >= 2 && GameState.enemies.length === 0){
            this.set_item_visible(GLOBALS.ITEM.TYPE.EXIT);
        }
        if (GameState.scope >= 3 && GameState.enemies.length <= 3){
            this.set_item_visible(GLOBALS.ITEM.TYPE.NONE);
        }
        if (GameState.scope >= 4 && GameState.enemies.length <= 2){
            this.set_item_visible(GLOBALS.ITEM.TYPE.BOX);
            this.set_item_visible(GLOBALS.ITEM.TYPE.ENERGY);
            this.set_item_visible(GLOBALS.ITEM.TYPE.POINT);
        }

    } // End of activate_scope

    set_item_visible(type){
        for (let j = 0 ; j < GameState.items.length; j++){
            if (GameState.items[j].type === type){
                GameState.items[j].set_visible(true);
            }
        }
    } // End of set_item_visible

}