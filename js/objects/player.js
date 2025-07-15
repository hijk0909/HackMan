// player.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { MyInput } from '../utils/InputUtils.js';
import { Movable } from './movable.js';

export class Player extends Movable {
    constructor(scene){
        super(scene);
    }

    init(type, pos){
        super.init(type, pos);
        this.size = 24;
        this.speed = GameState.player_speed;

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_p').setOrigin(0.5, 0.5);
        if (!this.scene.anims.exists('pd_anims')) {
            this.scene.anims.create({key:'pd_anims',
                frames: [ 
                    { key: 'ss_p', frame: 0},
                    { key: 'ss_p', frame: 1},
                    { key: 'ss_p', frame: 2},
                    { key: 'ss_p', frame: 1},
                ],
                frameRate: 4, repeat: -1
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
                frameRate: 4, repeat: -1
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
                frameRate: 4, repeat: -1
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
                frameRate: 4, repeat: -1
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
    } // End of init

    update(){
        // console.log("state:",GameState.flip_state," p_pos:",this.pos, " c_pos:",GameState.cursor.pos);
        if (GameState.flip_state === GLOBALS.FLIP_STATE.NONE){
            if (GameState.i_touch && GameState.cursor.visible){
                // カーソルへの移動量
                const {dx, dy} = this.vector_to_cursor();
                // 移動
                this.move(dx,dy);
            } else if (GameState.i_button){
                // カーソルのアジャスト（ボタン押下中）
                GameState.cursor.show();
                GameState.cursor.adjust(this.pos.x, this.pos.y);
                // カーソルへの移動量
                const {dx, dy} = this.vector_to_cursor();
                // 移動
                this.move(dx,dy);
            } else if (GameState.i_up || GameState.i_down || GameState.i_left || GameState.i_right){
                // 任意移動
                GameState.cursor.hide();
                let dx = 0, dy = 0;
                if (GameState.i_up){dy = -1;}
                if (GameState.i_down){dy = 1;}
                if (GameState.i_left){dx = -1;}
                if (GameState.i_right){dx = 1;}
                // 移動
                const before_pos = this.pos.clone();
                this.move(dx,dy);
                // キー操作しても動けない場合は、自動的にカーソルに向かう
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
            }
        } else if (GameState.flip_state === GLOBALS.FLIP_STATE.READY){
            // パネルとの同化状態
            if (GameState.i_touch && GameState.cursor.visible){
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
                    } else if (dx == 1 && plx < GLOBALS.FIELD.COL - 1){
                        this.flip_right(plx,ply);
                    }
                } else {
                    if (dy == -1 && ply > 0){
                        this.flip_up(plx,ply);
                    } else if (dy == 1 && ply < GLOBALS.FIELD.ROW - 1){
                        this.flip_down(plx,ply);
                    }
                }
            } else if (GameState.i_button){
                // ◆判定：キー操作でのフリップ開始
                const { loc_x: plx, loc_y : ply} = MyMath.get_loc_from_pos(this.pos.x, this.pos.y);
                if (GameState.i_up && ply > 0){
                    this.flip_up(plx, ply);
                } else if (GameState.i_down && ply < GLOBALS.FIELD.ROW - 1){
                    this.flip_down(plx, ply);
                } else if (GameState.i_left && plx > 0){
                    this.flip_left(plx, ply);
                } else if (GameState.i_right && plx < GLOBALS.FIELD.COL - 1){
                    this.flip_right(plx, ply);
                }
            } else {
                // ボタンが押されていないので同化状態を解除
                GameState.flip_state = GLOBALS.FLIP_STATE.NONE;
                this.setParentState(GLOBALS.PANEL.STATE.NORMAL);
            }
        } else if (GameState.flip_state === GLOBALS.FLIP_STATE.FLIP){
            // フリップ動作中
            this.pos.x += this.parent_panel.dx;
            this.pos.y += this.parent_panel.dy;
            if (this.parent_panel.state == GLOBALS.PANEL.STATE.NORMAL){
                GameState.flip_state = GLOBALS.FLIP_STATE.READY;
                this.setParentState(GLOBALS.PANEL.STATE.READY);
            }
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
        for (let i = 0 ; i < this.speed ; i ++){
            // ◆判定：移動
            if ( dx != 0 &&
                MyMath.isOnPath(this.pos.x + dx, this.pos.y) &&
                !MyMath.isOnOuterFence(this.pos.x + dx, this.pos.y, this.size)){
                this.pos.x += dx;
            }
            if ( dy != 0 &&
                MyMath.isOnPath(this.pos.x, this.pos.y + dy) &&
                !MyMath.isOnOuterFence(this.pos.x, this.pos.y + dy, this.size)){
                this.pos.y += dy;
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
                }
                // センターに達したら移動中止
                break;
            }

            // ◆判定：外壁タッチ
            const num = MyMath.getWallNumber(this.pos.x + dx, this.pos.y + dy, this.size);
            if (num !== null){
                const item = GameState.items[num];
                item.set_visible(true);
                if (item.type == GLOBALS.ITEM.TYPE.KEY){
                    // 鍵の取得
                    item.set_blink_out();
                    GameState.ui.add_collection(GLOBALS.ITEM.TYPE.KEY);
                    GameState.sound.se_key.play();
                } else if (item.type == GLOBALS.ITEM.TYPE.EXIT){
                    // 出口にタッチ
                    if (GameState.ui.check_collection(GLOBALS.ITEM.TYPE.KEY)){
                        GameState.state = GLOBALS.GAME.STATE.FLOOR_CLEAR;
                        GameState.count = GLOBALS.GAME.PERIDO.FLOOR_CLEAR;
                        GameState.ui.remove_collection(GLOBALS.ITEM.TYPE.KEY);
                        GameState.sound.se_exit.play();
                    }
                }
                break;
            }
        }

        // アニメーションの設定
        if (GameState.flip_state === GLOBALS.FLIP_STATE.NONE){
            if (dx == 0 && dy == 0){
                this.sprite.stop();
                this.sprite.setFrame(1);
            } else {
                let anims_key = null;
                if ( dx < 0 ){
                    anims_key = 'pl_anims';
                } else if ( dx > 0){
                    anims_key = 'pr_anims';
                } else if ( dy < 0){
                    anims_key = 'pu_anims';
                } else if ( dy > 0){
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
    }

    isOuterFence(dx,dy){
        const r1 = MyMath.isOnOuterFence(this.pos.x + dx, this.pos.y, this.size);
        const r2 = MyMath.isOnOuterFence(this.pos.x, this.pos.y + dy, this.size);
        return (r1 || r2);
    }

    setParentState(state){
        const { loc_x: plx, loc_y : ply} = MyMath.get_loc_from_pos(this.pos.x, this.pos.y);
        this.parent_panel = GameState.panels[plx][ply];
        this.parent_panel.state = state;
    }
}