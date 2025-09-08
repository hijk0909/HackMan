// player_touch_item.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Effect } from './effect.js';

    // ◆アイテム処理
export function touch_item(item){
    item.set_visible(true);
    if (item.type === GLOBALS.ITEM.TYPE.KEY){
        // ◆鍵の取得
        GameState.ui.collection_add_key();
        GameState.sound.se_key.play();
        item.set_blink_out();
    } else if (item.type === GLOBALS.ITEM.TYPE.EXIT){
        // ◆出口にタッチ。鍵の削除
        if (GameState.ui.collection_check(GLOBALS.ITEM.TYPE.KEY)){
            GameState.state = GLOBALS.GAME.STATE.FLOOR_CLEAR;
            GameState.count = GLOBALS.GAME.PERIDO.FLOOR_CLEAR;
            GameState.ui.collection_remove(GLOBALS.ITEM.TYPE.KEY);
            GameState.sound.se_unlock.play();
            GameState.sound.se_exit.play();
        }
    } else if (item.type === GLOBALS.ITEM.TYPE.BOX_OPEN){
        // ◆解錠済み宝箱（中身の確認）
        item.set_type(item.inner_type);
        GameState.item_boxes[GameState.floor] = true;
        //フロア数の表示色の変更
        GameState.setup.show_floor(); 
        // 即時取得（自己呼び出し）
        touch_item(item); 
    } else if (item.type === GLOBALS.ITEM.TYPE.NONE){
        // ◆アイテム無し
            GameState.sound.se_item_none.play();
    } else if (item.type === GLOBALS.ITEM.TYPE.BOX){
        // ◆施錠中の宝箱
    } else if (item.type === GLOBALS.ITEM.TYPE.SPEED){
        // ◆[アイテム] プレイヤー速度アップ
        if (GameState.player_speed < GLOBALS.PLAYER_SPEED_MAX){
            GameState.player_speed += 1;
            GameState.ui.collection_update_speed(true);
            GameState.sound.se_powerup.play();
        } else {
            GameState.player.add_score(GLOBALS.MAX_BONUS);
        }
        item.set_blink_out();
    } else if (item.type === GLOBALS.ITEM.TYPE.FLIP){
        // ◆[アイテム] フリップ速度アップ
        if (GameState.flip_speed < GLOBALS.FLIP_SPEED_MAX){
            GameState.flip_speed += 1;
            GameState.ui.collection_update_flip(true);
            GameState.sound.se_powerup.play();
        } else {
            GameState.player.add_score(GLOBALS.MAX_BONUS);
        }
        item.set_blink_out();
    } else if (item.type === GLOBALS.ITEM.TYPE.BARRIER){
        // ◆[アイテム] バリア
        if (GameState.barrier < GLOBALS.BARRIER_MAX){
            GameState.barrier += 1;
            GameState.ui.collection_update_barrier(true);
            GameState.sound.se_powerup.play();
            GameState.player.set_barrier();
        } else {
            GameState.player.add_score(GLOBALS.MAX_BONUS);
        }
        item.set_blink_out();
    } else if (item.type === GLOBALS.ITEM.TYPE.ENERGY){
        // ◆エネルギーアップ
        GameState.add_energy(1000);
        GameState.sound.se_powerup.play();
        item.set_blink_out();
    } else if (item.type === GLOBALS.ITEM.TYPE.POINT){
        // ◆得点アップ
        GameState.player.add_score(1000);
        item.set_blink_out();
    } else if (item.type === GLOBALS.ITEM.TYPE.RING){
        // ◆リング（得点アップ）
        GameState.player.add_score(3000);
        item.set_blink_out();
    } else if (item.type === GLOBALS.ITEM.TYPE.INVINCIBLE){
        // ◆無敵
        GameState.invincible = true;
        GameState.player.status_timer.reset_timer(10);
        GameState.sound.se_item_invincible.play();
        item.set_blink_out();
    } else if (item.type >= GLOBALS.ITEM.TYPE.PICT_MIN && item.type <= GLOBALS.ITEM.TYPE.PICT_MAX){
        // ◆絵合わせ
        const next_type = item.type === GLOBALS.ITEM.TYPE.PICT_MAX ? GLOBALS.ITEM.TYPE.PICT_MIN : item.type + 1;
        item.set_type(next_type);
        GameState.sound.se_pict_change.play();
    } else if (item.type === GLOBALS.ITEM.TYPE.GLOVE){
        // ◆グローブ
        if (GameState.glove < GLOBALS.GLOVE_MAX){
            GameState.glove += 1;
            GameState.ui.collection_update_glove(true);
            GameState.sound.se_powerup.play();
        } else {
            GameState.player.add_score(GLOBALS.MAX_BONUS);
        }
        item.set_blink_out();
    } else if (item.type === GLOBALS.ITEM.TYPE.USB){
        // ◆ＵＳＢ
        if (GameState.usb < GLOBALS.USB_MAX){
            GameState.usb += 1;
            GameState.ui.collection_update_usb(true);
            GameState.sound.se_powerup.play();
        } else {
            GameState.player.add_score(GLOBALS.MAX_BONUS);
        }
        item.set_blink_out();
    } else if (item.type === GLOBALS.ITEM.TYPE.VISUALIZER){
        // ◆スコープ
        if (GameState.visualizer < GLOBALS.VISUALIZER_MAX){
            GameState.visualizer += 1;
            GameState.ui.collection_update_visualizer(true);
            GameState.sound.se_powerup.play();
        } else {
            GameState.player.add_score(GLOBALS.MAX_BONUS);
        }
        item.set_blink_out();
    } else if (item.type >= GLOBALS.ITEM.TYPE.LAUNCHER_MIN && item.type <= GLOBALS.ITEM.TYPE.LAUNCHER_MAX){
        // ◆発射台（Launcher）
        if ( GameState.glove >= 1){
            item.set_blink_out();
            GameState.add_score(300);
            const eff = new Effect(GameState.player.scene);
            eff.init(GLOBALS.EFFECT.TYPE.EXPLOSION,new Phaser.Math.Vector2(item.pos.x, item.pos.y));
            GameState.effects.push(eff);
            GameState.sound.se_explosion.play();
        }
    } else if (item.type >= GLOBALS.ITEM.TYPE.GENERATOR_MIN && item.type <= GLOBALS.ITEM.TYPE.GENERATOR_MAX){
        if (item.isOneTime){
            GameState.sound.se_trap.play();
        } else {
            // ◆敵発生器（Generator） vs. GLOVE
            if ((item.type === GLOBALS.ITEM.TYPE.GENERATOR_1 && GameState.glove >= 2) ||
                (item.type === GLOBALS.ITEM.TYPE.GENERATOR_2 && GameState.glove >= 3) ||
                (item.type === GLOBALS.ITEM.TYPE.GENERATOR_3 && GameState.glove >= 4)){
                GameState.add_score(500);
                const eff = new Effect(GameState.player.scene);
                eff.init(GLOBALS.EFFECT.TYPE.EXPLOSION,new Phaser.Math.Vector2(item.pos.x, item.pos.y));
                GameState.effects.push(eff);
                GameState.sound.se_explosion.play();
                item.set_blink_out();
            }
        }
    } else if (item.type >= GLOBALS.ITEM.TYPE.TERMINAL_MIN && item.type <= GLOBALS.ITEM.TYPE.TERMINAL_MAX){
        // ◆ハッキング用端末（Terminal）vs. USB
        if (item.type === GLOBALS.ITEM.TYPE.TERMINAL_1 && GameState.usb >= 1){
            GameState.player.eliminate_enemy(GLOBALS.ENEMY.TRIBE.E1);
            GameState.player.eliminate_enemy(GLOBALS.ENEMY.TRIBE.E2);
            item.set_blink_out();
        } else if (item.type === GLOBALS.ITEM.TYPE.TERMINAL_2 && GameState.usb >= 2){
            GameState.player.eliminate_enemy(GLOBALS.ENEMY.TRIBE.E3);
            GameState.player.eliminate_enemy(GLOBALS.ENEMY.TRIBE.E4);
            item.set_blink_out();
        } else if (item.type === GLOBALS.ITEM.TYPE.TERMINAL_3 && GameState.usb >= 3){
            GameState.player.eliminate_enemy(GLOBALS.ENEMY.TRIBE.E5);
            item.set_blink_out();
        }
    } else {
        // 想定外のアイテム
    }
} // End of item_touch