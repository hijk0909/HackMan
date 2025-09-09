// player.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Movable } from './movable.js';
import { Effect } from './effect.js';
import { touch_item } from './player_touch_item.js';

const BLINK_PERIOD = 2;

export class Player extends Movable {
    constructor(scene){
        super(scene);
        this.touch_wall = false;
        this.flip_frame = null;
        this.sprite_barrier = null;
        this.status_timer = null;
        this.blink_counter = 0;
        this.blink = false;
    }

    init(type, pos){
        super.init(type, pos);
        this.size = 24;
        this.flip_frame = new flip_frame(this.scene);

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_p').setOrigin(0.5, 0.5);
        this.set_shadow();
        if (!this.scene.anims.exists('pd_anims')) {
            this.scene.anims.create({key:'pd_anims',
                frames: [ 
                    { key: 'ss_p', frame: 0},
                    { key: 'ss_p', frame: 1},
                    { key: 'ss_p', frame: 2},
                    { key: 'ss_p', frame: 1},
                ],
                frameRate: 6, repeat: -1
            });
        }
        if (!this.scene.anims.exists('pr_anims')) {
            this.scene.anims.create({key:'pr_anims',
                frames: [ 
                    { key: 'ss_p', frame: 6},
                    { key: 'ss_p', frame: 7},
                    { key: 'ss_p', frame: 8},
                    { key: 'ss_p', frame: 7},
                ],
                frameRate: 6, repeat: -1
            });
        }
        if (!this.scene.anims.exists('pl_anims')) {
            this.scene.anims.create({key:'pl_anims',
                frames: [ 
                    { key: 'ss_p', frame: 3},
                    { key: 'ss_p', frame: 4},
                    { key: 'ss_p', frame: 5},
                    { key: 'ss_p', frame: 4},
                ],
                frameRate: 6, repeat: -1
            });
        }
        if (!this.scene.anims.exists('pu_anims')) {
            this.scene.anims.create({key:'pu_anims',
                frames: [ 
                    { key: 'ss_p', frame: 9},
                    { key: 'ss_p', frame: 10},
                    { key: 'ss_p', frame: 11},
                    { key: 'ss_p', frame: 10},
                ],
                frameRate: 6, repeat: -1
            });
        }
        if (!this.scene.anims.exists('pa_anims')) {
            this.scene.anims.create({key:'pa_anims',
                frames: [ 
                    { key: 'ss_p', frame: 12}
                ],
                frameRate: 1, repeat: -1
            });
        }

        this.sprite.play('pd_anims');

        this.sprite_barrier = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_p').setOrigin(0.5, 0.5).setFrame(19).setDepth(1).setVisible(false);
        if (!this.scene.anims.exists('pb_anims')) {
            this.scene.anims.create({key:'pb_anims',
                frames: [ 
                    { key: 'ss_p', frame: 18},
                    { key: 'ss_p', frame: 19},
                    { key: 'ss_p', frame: 20}
                ],
                frameRate: 16, repeat: -1
            });
        }

        this.set_barrier();
        this.status_timer = new StatusTimer(this.scene);
        this.blink_counter = 0;
    } // End of init

    update(){
        // console.log("state:",GameState.flip_state," p_pos:",this.pos, " c_pos:",GameState.cursor.pos);
        if (GameState.flip_state === GLOBALS.FLIP_STATE.NONE){
            if (GameState.i_touch && GameState.cursor.visible){
                // タッチ時：カーソルへ移動
                const {dx, dy} = this.vector_to_cursor();
                this.move(dx,dy);
            } else if (GameState.i_button){
                // ボタン押下時：カーソルをプレイヤー位置に合わせる
                GameState.cursor.show();
                GameState.cursor.adjust(this.pos.x, this.pos.y);
                // カーソルへの移動量
                const {dx, dy} = this.vector_to_cursor();
                // 移動
                this.move(dx,dy);
            } else if (GameState.i_up || GameState.i_down || GameState.i_left || GameState.i_right){
                // キー操作による移動
                GameState.cursor.hide();
                let dx = 0, dy = 0;
                if (GameState.i_up){dy = -1;}
                if (GameState.i_down){dy = 1;}
                if (GameState.i_left){dx = -1;}
                if (GameState.i_right){dx = 1;}
                // 移動
                const before_pos = this.pos.clone();
                this.move(dx,dy);
                // キー操作しても動けない場合は、自動的にカーソル（中央）に向かう
                if (before_pos.equals(this.pos)){
                    if (!this.isOuterFence(dx,dy)){
                        GameState.cursor.adjust(this.pos.x, this.pos.y);
                        const {dx, dy} = this.vector_to_cursor();
                        this.move(dx,dy);
                    }
                }
            } else {
                // 停止
                this.sprite.stop();
                this.sprite.setFrame(1);
                if (GameState.energy < GLOBALS.ENERGY_MAX){
                    GameState.add_energy(1);
                }
            }
        } else if (GameState.flip_state === GLOBALS.FLIP_STATE.READY){
            // パネルとの同化状態
            if (GameState.i_touch && GameState.cursor.visible){
                if (GameState.energy >= GLOBALS.FLIP_ENRGY){
                    // ◆判定：タッチ操作でのフリップ開始
                    const { loc_x: clx, loc_y : cly} = MyMath.get_loc_from_pos(GameState.cursor.pos.x, GameState.cursor.pos.y);
                    const { loc_x: plx, loc_y : ply} = MyMath.get_loc_from_pos(this.pos.x, this.pos.y);
                    const dx = ( plx < clx) ? 1 :
                            (plx > clx) ? -1 : 0;
                    const dy = ( ply < cly) ? 1 :
                            (ply > cly) ? -1 : 0;
                    // X軸・Y軸を比較し、距離の大きいほうを優先してフリップ
                    if (Math.abs(plx-clx)>Math.abs(ply-cly)){
                        if (dx == -1 && plx > 0){
                            this.flip_left(plx,ply);
                            GameState.add_energy( -GLOBALS.FLIP_ENRGY);
                        } else if (dx == 1 && plx < GameState.field_col - 1){
                            this.flip_right(plx,ply);
                            GameState.add_energy( -GLOBALS.FLIP_ENRGY);
                        }
                    } else {
                        if (dy == -1 && ply > 0){
                            this.flip_up(plx,ply);
                            GameState.add_energy( -GLOBALS.FLIP_ENRGY);
                        } else if (dy == 1 && ply < GameState.field_row - 1){
                            this.flip_down(plx,ply);
                            GameState.add_energy( -GLOBALS.FLIP_ENRGY);
                        }
                    }
                } else {
                    // ●エネルギー不足
                }
            } else if (GameState.i_button){
                if (GameState.energy >= GLOBALS.FLIP_ENRGY){
                    // ◆判定：キー操作でのフリップ開始
                    const { loc_x: plx, loc_y : ply} = MyMath.get_loc_from_pos(this.pos.x, this.pos.y);
                    if (GameState.i_up && ply > 0){
                        this.flip_up(plx, ply);
                        GameState.cursor.hide();
                        GameState.add_energy(-GLOBALS.FLIP_ENRGY);
                    } else if (GameState.i_down && ply < GameState.field_row - 1){
                        this.flip_down(plx, ply);
                        GameState.cursor.hide();
                        GameState.add_energy(-GLOBALS.FLIP_ENRGY);
                    } else if (GameState.i_left && plx > 0){
                        this.flip_left(plx, ply);
                        GameState.cursor.hide();
                        GameState.add_energy(-GLOBALS.FLIP_ENRGY);
                    } else if (GameState.i_right && plx < GameState.field_col - 1){
                        this.flip_right(plx, ply);
                        GameState.cursor.hide();
                        GameState.add_energy(-GLOBALS.FLIP_ENRGY);
                    }
                } else {
                    // ●エネルギー不足
                }
            } else {
                // ボタンが押されていないので同化状態を解除
                GameState.flip_state = GLOBALS.FLIP_STATE.NONE;
                this.setParentState(GLOBALS.PANEL.STATE.NORMAL);
                GameState.cursor.hide();
                GameState.shockwave.stop();
            }
        } else if (GameState.flip_state === GLOBALS.FLIP_STATE.FLIP){
            // フリップ動作中
            this.pos.x += this.parent_panel.dx;
            this.pos.y += this.parent_panel.dy;
            if (this.parent_panel.state == GLOBALS.PANEL.STATE.NORMAL){
                GameState.flip_state = GLOBALS.FLIP_STATE.READY;
                this.setParentState(GLOBALS.PANEL.STATE.READY);
                this.flip_frame.set_visible(false);
            }
        }

        this.flip_frame.draw();
        this.sprite_barrier.setPosition(this.pos.x, this.pos.y);

        // 無敵状態
        if (GameState.invincible){
            // 点滅表示
            this.blink_counter -= 1;
            if (this.blink_counter < 0){
                this.blink_counter = BLINK_PERIOD;
                if (this.blink){
                    this.blink = false;
                    this.sprite.clearTint();
                } else {
                    this.blink = true;
                    this.sprite.setTintFill(0xffffff);
                }
            }
            // タイマーの更新
            if (!this.status_timer.update()){
                GameState.invincible = false;
            }
        } else {
            this.sprite.clearTint();
        }
 
        super.update();
    } // End of update

    // カーソルに向けた移動ベクトル
    vector_to_cursor(){
        let dx = 0, dy = 0;
        const curx = GameState.cursor.pos.x;
        const cury = GameState.cursor.pos.y;
        dx = (this.pos.x < curx) ? 1 :
                (this.pos.x > curx) ? -1 : 0;
        dy = (this.pos.y < cury) ? 1 :
                (this.pos.y > cury) ? -1 : 0;
        return {dx, dy};
    }

    // 移動
    move(dx, dy){
        let mx = 0, my = 0;
        for (let i = 0 ; i < GameState.player_speed ; i ++){
            // ◆判定：移動
            if ( dx != 0 &&
                MyMath.isOnPath(this.pos.x + dx, this.pos.y) &&
                !MyMath.isOnOuterFence(this.pos.x + dx, this.pos.y, this.size)){
                this.pos.x += dx;
                mx = dx;
            }
            if ( dy != 0 &&
                MyMath.isOnPath(this.pos.x, this.pos.y + dy) &&
                !MyMath.isOnOuterFence(this.pos.x, this.pos.y + dy, this.size)){
                this.pos.y += dy;
                my = dy;
            }

            // ◆判定：センターで一時停止・パネル同化状態への遷移
            if (this.pos.x === GameState.cursor.pos.x &&
                this.pos.y === GameState.cursor.pos.y){
                if (GameState.i_touch || GameState.i_button){
                    GameState.flip_state = GLOBALS.FLIP_STATE.READY;
                    const anims_key = 'pa_anims';
                    this.setParentState(GLOBALS.PANEL.STATE.READY);
                    if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim.key !== anims_key) {
                        this.sprite.play(anims_key);
                    }
                    GameState.shockwave.start();
                }
                // センターに達したら移動中止
                break;
            }

            // ◆判定：外壁タッチ（アイテム取得判定）
            const num = MyMath.getWallNumber(this.pos.x + dx, this.pos.y + dy, this.size);
            if (num === null){
                // 壁から離れている
                this.touch_wall = false;
            } else if ( this.touch_wall === false){
                // 壁から離れた状態からのタッチ
                const item = GameState.items[num];
                touch_item(item);
                this.touch_wall = true;
                break;
            }
        }

        // アニメーションの設定
        if (GameState.flip_state === GLOBALS.FLIP_STATE.NONE){
            // 実際に動いた量(mx,my)に従ってアニメーション
            if (mx == 0 && my == 0){
                this.sprite.stop();
                this.sprite.setFrame(1);
            } else {
                let anims_key = null;
                if ( mx < 0 ){
                    anims_key = 'pl_anims';
                } else if ( mx > 0){
                    anims_key = 'pr_anims';
                } else if ( my < 0){
                    anims_key = 'pu_anims';
                } else if ( my > 0){
                    anims_key = 'pd_anims';
                }
                if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim.key !== anims_key) {
                    this.sprite.play(anims_key);
                }
            }
        }
    }

    // 上とフリップ
    flip_up(plx, ply){
        const p1 = GameState.panels[plx][ply-1];
        p1.set_flip(GLOBALS.DIR.DOWN,GLOBALS.PANEL.STATE.FLIP_BELOW);
        const p2 = GameState.panels[plx][ply];
        p2.set_flip(GLOBALS.DIR.UP,GLOBALS.PANEL.STATE.FLIP_ABOVE);
        GameState.panels[plx][ply] = p1;
        GameState.panels[plx][ply-1] = p2;
        this.parent_panel = p2;
        p1.flip_pair = p2;
        p2.flip_pair = p1;
        GameState.flip_state = GLOBALS.FLIP_STATE.FLIP;
        this.flip_frame.set_rect(plx,ply-1,1,2);
    }

    // 下とフリップ
    flip_down(plx, ply){
        const p1 = GameState.panels[plx][ply+1];
        p1.set_flip(GLOBALS.DIR.UP,GLOBALS.PANEL.STATE.FLIP_BELOW);
        const p2 = GameState.panels[plx][ply];
        p2.set_flip(GLOBALS.DIR.DOWN,GLOBALS.PANEL.STATE.FLIP_ABOVE);
        GameState.panels[plx][ply] = p1;
        GameState.panels[plx][ply+1] = p2;
        this.parent_panel = p2;
        p1.flip_pair = p2;
        p2.flip_pair = p1;
        GameState.flip_state = GLOBALS.FLIP_STATE.FLIP;
        this.flip_frame.set_rect(plx,ply,1,2);
    }

    // 右とフリップ
    flip_right(plx, ply){
        const p1 = GameState.panels[plx+1][ply];
        p1.set_flip(GLOBALS.DIR.LEFT,GLOBALS.PANEL.STATE.FLIP_BELOW);
        const p2 = GameState.panels[plx][ply];
        p2.set_flip(GLOBALS.DIR.RIGHT,GLOBALS.PANEL.STATE.FLIP_ABOVE);
        GameState.panels[plx][ply] = p1;
        GameState.panels[plx+1][ply] = p2;
        this.parent_panel = p2;
        p1.flip_pair = p2;
        p2.flip_pair = p1;
        GameState.flip_state = GLOBALS.FLIP_STATE.FLIP;
        this.flip_frame.set_rect(plx,ply,2,1);
    }

    // 左とフリップ
    flip_left(plx, ply){
        const p1 = GameState.panels[plx-1][ply];
        p1.set_flip(GLOBALS.DIR.RIGHT,GLOBALS.PANEL.STATE.FLIP_BELOW);
        const p2 = GameState.panels[plx][ply];
        p2.set_flip(GLOBALS.DIR.LEFT,GLOBALS.PANEL.STATE.FLIP_ABOVE);
        GameState.panels[plx][ply] = p1;
        GameState.panels[plx-1][ply] = p2;
        this.parent_panel = p2;
        p1.flip_pair = p2;
        p2.flip_pair = p1;
        GameState.flip_state = GLOBALS.FLIP_STATE.FLIP;
        this.flip_frame.set_rect(plx-1,ply,2,1);
    }

    isOuterFence(dx,dy){
        // 現在位置から(dx,dy)ずれた位置が隣接パネルや外壁に接しているか
        const r1 = MyMath.isOnOuterFence(this.pos.x + dx, this.pos.y, this.size);
        const r2 = MyMath.isOnOuterFence(this.pos.x, this.pos.y + dy, this.size);
        return (r1 || r2);
    }

    setParentState(state){
        // 親パネルの状態設定
        const { loc_x: plx, loc_y : ply} = MyMath.get_loc_from_pos(this.pos.x, this.pos.y);
        this.parent_panel = GameState.panels[plx][ply];
        this.parent_panel.state = state;
    }

    stop_animation(){
        // 自機のアニメーションを止める
        this.sprite.stop();
    }

    add_score(score){
        GameState.add_score(score);
        // サウンドエフェクト
        GameState.sound.se_bonus.play();
        // テキストエフェクト
        const eff = new Effect(this.scene);
        eff.init(GLOBALS.EFFECT.TYPE.TEXT,new Phaser.Math.Vector2(this.pos.x, this.pos.y));
        GameState.effects.push(eff);
        eff.set_text("+" + score);
    }

    set_barrier(){
        if (GameState.barrier > 0){
            this.sprite_barrier.setVisible(true);
            this.sprite_barrier.play('pb_anims');
        } else {
            this.sprite_barrier.setVisible(false);
            this.sprite_barrier.stop();
        }
    }

    eliminate_enemy(tribe){
        for (let i = GameState.enemies.length - 1; i >= 0; i--) {
            const e = GameState.enemies[i];
            // console.log("e.tribe", e.tribe);
            if (e.tribe === tribe){
                e.setAlive(false);
                GameState.add_score(e.score);
                // 爆発エフェクト
                const eff1 = new Effect(this.scene);
                eff1.init(GLOBALS.EFFECT.TYPE.EXPLOSION,new Phaser.Math.Vector2(e.pos.x, e.pos.y));
                GameState.sound.se_explosion.play();
                GameState.effects.push(eff1);
                // レーザーエフェクト
                const eff2 = new Effect(this.scene);
                eff2.init(GLOBALS.EFFECT.TYPE.LASER,this.pos);
                eff2.set_target_pos(e.pos);
                GameState.effects.push(eff2);
            }
        }
    }

    destroy(){
        if ( this.flip_frame ){
            this.flip_frame.destroy();
            this.flip_frame = null;
        }
        if ( this.sprite_barrier ){
            this.sprite_barrier.destroy();
            this.sprite_barrier = null;
        }
        if ( this.status_timer ){
            this.status_timer.destroy();
            this.status_timer = null;
        }
        super.destroy();
    }
}


// フリップ時のフレーム描画
const FRAME_BLINK_SPEED = 20;
const FRAME_EFFECT_PERIOD = 35;
const FRAME_COLOR = 0xff0000;
const FRAME_EFFECT_COLOR = 0xffe000;

class flip_frame{
    constructor(scene){
        this.scene = scene;
        this.graphics1 = this.scene.add.graphics().setDepth(3);
        this.graphics2 = this.scene.add.graphics().setDepth(3);
        this.frame =  new Phaser.Geom.Rectangle(0, 0, 0, 0);
        this.visible = false;
        this.cycle = 0;
        this.count = 0;
    }

    set_rect(loc_x, loc_y, num_width, num_height){
        const {top, left} = MyMath.get_top_left_from_loc(loc_x, loc_y);
        this.frame.x = top;
        this.frame.y = left;
        this.frame.width = num_width * GLOBALS.PANEL.WIDTH;
        this.frame.height = num_height * GLOBALS.PANEL.HEIGHT;
        this.set_visible(true);
        this.cycle = 0;
        this.count = 0;
    }

    set_visible(visible){
        this.visible = visible;
    }

    draw(){
        this.graphics1.clear();
        this.graphics2.clear();
        if (this.visible){
            this.cycle = this.cycle + FRAME_BLINK_SPEED > 360 ? this.cycle + FRAME_BLINK_SPEED - 360 : this.cycle + FRAME_BLINK_SPEED;
            const alpha = (Math.sin(MyMath.radians(this.cycle)) + 1) / 2;
            this.graphics1.lineStyle(5, FRAME_COLOR);
            this.graphics1.strokeRect(this.frame.x, this.frame.y, this.frame.width, this.frame.height).setAlpha(alpha);
            this.count = this.count > FRAME_EFFECT_PERIOD ? this.count = 0 : this.count + 1;
            this.graphics2.lineStyle(2, FRAME_EFFECT_COLOR);
            this.graphics2.strokeRect(this.frame.x - this.count, this.frame.y - this.count, this.frame.width + this.count * 2, this.frame.height + this.count * 2).setAlpha(1 - this.count / FRAME_EFFECT_PERIOD);
        }
    }

    destroy(){
        if ( this.graphics1 ){
            this.graphics1.destroy();
            this.graphics1 = null;
        }
        if ( this.graphics2 ){
            this.graphics2.destroy();
            this.graphics2 = null;
        }
    }
} // End of Player

const STATUS_TIMER_OFFSET = 32;
const STATUS_TIMER_COUNTER_PERIOD = 60;

class StatusTimer {
    constructor(scene){
        this.scene = scene;
        this.textObject = null;
        this.timer = 0;
        this.counter = 0;
    }

    set_text(txt){
        if (!this.textObject) {
            this.textObject = this.scene.add.text(GameState.player.pos.x, GameState.player.pos.y - STATUS_TIMER_OFFSET, txt, {
            fontFamily: 'Helvetica, Arial',
            fontSize: '28px',
            color: '#ffeedd',
            stroke: '#802000',
            strokeThickness: 2
            }).setOrigin(0.5, 0.5).setVisible(true).setDepth(2);
        } else {
            this.textObject.setText(txt);
            this.textObject.setPosition(GameState.player.pos.x, GameState.player.pos.y - STATUS_TIMER_OFFSET);
        }
    }

    reset_timer(timer){
        this.timer = timer;
        this.counter = STATUS_TIMER_COUNTER_PERIOD;
        this.set_text(this.timer);
    }

    update(){
        if (this.textObject){
            this.textObject.setPosition(GameState.player.pos.x, GameState.player.pos.y - STATUS_TIMER_OFFSET);
            this.counter -= 1;
            if (this.counter < 0){
                this.counter = STATUS_TIMER_COUNTER_PERIOD;
                this.timer -= 1;
                this.set_text(this.timer);
                if (this.timer < 0){
                    this.textObject.setVisible(false);
                    return false;
                }
            }
            return true;
        }
    }

    destroy(){
        if ( this.textObject ){
            this.textObject.destroy();
            this.textObject = null;
        }
    }

} // End of StatusTimer