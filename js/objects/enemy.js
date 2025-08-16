// enemy.js
import { Movable } from './movable.js';
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Effect } from './effect.js';

const WRIGGLE_RANGE = 5;

export class Enemy extends Movable {

    constructor(scene){
        super(scene);
        this.score = 0;
        this.dir = GLOBALS.DIR.RIGHT;
        this.flip_state = GLOBALS.FLIP_STATE.NONE;
        this.parent_panel = null;
        this.bullet = null;
    }

    update(){
        if (this.flip_state === GLOBALS.FLIP_STATE.NONE){
            // 親パネルのフリップ状態を確認
            const { loc_x: plx, loc_y : ply} = MyMath.get_loc_from_pos(this.pos.x, this.pos.y);
            let p = null;
            if (plx>=0 && plx<GameState.field_col && ply>=0 && ply<GameState.field_row){
                p = GameState.panels[plx][ply];
            }
            if (p &&(
                p.state == GLOBALS.PANEL.STATE.FLIP_ABOVE ||
                p.state == GLOBALS.PANEL.STATE.FLIP_BELOW)){
                this.parent_panel = p.flip_pair;
                this.flip_state = GLOBALS.FLIP_STATE.FLIP;
            }
        }

        if (this.flip_state === GLOBALS.FLIP_STATE.NONE){
            // 通常状態
            if (MyMath.isOnOuterFence(this.pos.x, this.pos.y, this.size)){
                // 現在地点が既に衝突して動けない場合（振動）
                this.offset.x = Math.random() * WRIGGLE_RANGE;
                this.offset.y = Math.random() * WRIGGLE_RANGE;
            } else {
                this.offset.x = 0;
                this.offset.y = 0;
            }
            this._move();
        } else if (this.flip_state === GLOBALS.FLIP_STATE.FLIP){
            // 親パネルに動きを同期
            this.sprite.setTint(GLOBALS.COLOR.FLIP_TINE);
            this.pos.x += this.parent_panel.dx;
            this.pos.y += this.parent_panel.dy;
            if (this.parent_panel.state === GLOBALS.PANEL.STATE.NORMAL){
                this.flip_state = GLOBALS.FLIP_STATE.NONE;
                this.sprite.setTint(0xffffff);
            } else if (this.parent_panel.state === GLOBALS.PANEL.STATE.FLIP_BELOW){
                if (MyMath.isHittingAboveFence(this.pos.x, this.pos.y, this.size, this.parent_panel.flip_pair)){
                    // ◆プレイヤー（上側）パネルのフェンスに蹂躙される（破壊）
                    this.alive = false;
                    GameState.add_score(this.score);
                    const eff = new Effect(this.scene);
                    eff.init(GLOBALS.EFFECT.TYPE.EXPLOSION,new Phaser.Math.Vector2(this.pos.x, this.pos.y));
                    GameState.sound.se_explosion.play();
                    GameState.effects.push(eff);
                }
            }
        }
        // console.log("pos",this.pos.x, this.pos.y);

        super.update();
    }

    _move(){
        // サブクラスで実装
    }

    _onCenter(){
        // サブクラスで実装
    }

    move_straight(){
        let result = true;
        for (let i=0;i<this.speed;i++){
            const next_pos_x = this.pos.x + GLOBALS.DIR_X[this.dir];
            const next_pos_y = this.pos.y + GLOBALS.DIR_Y[this.dir];
            if ( MyMath.isOnPath(next_pos_x, next_pos_y) &&
                !MyMath.isOnOuterFence(next_pos_x, next_pos_y, this.size)){
                this.pos.x = next_pos_x;
                this.pos.y = next_pos_y;
            } else {
                result = false;
                break;
            }
            if ( MyMath.isCenter(this.pos.x, this.pos.y)){
                this._onCenter();
            }
        }
        // console.log("move_straight:",this.pos.x, this.pos.y);
        return result;
    }

    shoot_bullet(dir){
        const b = new this.bullet(this.scene);
        b.init(0,new Phaser.Math.Vector2(this.pos.x, this.pos.y));
        b.set_dir(dir);
        GameState.bullets.push(b);
    }

    destroy(){
        super.destroy();
    }
}