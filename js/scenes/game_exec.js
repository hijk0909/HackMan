// game_exec.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyMath} from '../utils/MathUtils.js';

export class Exec {
    constructor(scene) {
        this.scene = scene;
    }

    update(){
        // 時間
        GameState.time -= 1;
        if (GameState.time <= 0){
            GameState.state = GLOBALS.GAME.STATE.FAILED;
            GameState.count = GLOBALS.GAME.PERIDO.FAILED;
            GameState.ui.show_timeover(true);
        }

        // カーソルの更新
        GameState.cursor.update();

        // パネルの更新
        for (let i=0; i<GLOBALS.FIELD.COL; i++){
            for (let j=0; j<GLOBALS.FIELD.ROW; j++){
                GameState.panels[i][j].update();
            }
        }

        // プレイヤーの更新
        GameState.player.update();

        // 敵の管理 と プレイヤーとの当たり判定
        for (let i = GameState.enemies.length - 1; i >= 0; i--) {
            const e = GameState.enemies[i];
            e.update();
            if (!e.isAlive()) {
                e.destroy();
                GameState.enemies.splice(i, 1);
                continue;
            }
            if (MyMath.isHittingCharacter(e.pos,e.size,GameState.player.pos,GameState.player.size)){
                GameState.state = GLOBALS.GAME.STATE.FAILED;
                GameState.count = GLOBALS.GAME.PERIDO.FAILED;
                GameState.sound.se_failed.play();
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
                GameState.sound.se_failed.play();
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
            c = GLOBALS.COLOR.WALL_NORMAL;
        } else if (GameState.flip_state === GLOBALS.FLIP_STATE.READY){
            c = GLOBALS.COLOR.WALL_READY;
        } else if (GameState.flip_state === GLOBALS.FLIP_STATE.FLIP){
            c = GLOBALS.COLOR.WALL_FLIP;
        }
        for (let i=0; i < GLOBALS.FIELD.ROW*2 + GLOBALS.FIELD.COL*2 + 4;i++){
            GameState.walls[i].sprite.setTint(c);
        }

    } // End of update
}