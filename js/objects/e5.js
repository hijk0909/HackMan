// e5.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';
import { B1 } from './b1.js';
import { B2 } from './b2.js';
import { B3 } from './b3.js';

const ST_NORM = 0;
const ST_TURN = 1;

const RES_NORM = 0;
const RES_BLOCKED = 1;
const RES_CENTER = 2;

export class E5 extends Enemy {

    constructor(scene){
        super(scene);
        this.score = 0;
        this.size = 24;
        this.speed = 3;
        this.state = ST_NORM;
        this.anims = null;
    }

    init(type, pos){

        const type_defs = [
            {type:0, anims: 'e5_anims_0_', base: 0, bullet:null},
            {type:1, anims: 'e5_anims_1_', base:12, bullet:B1},
            {type:2, anims: 'e5_anims_2_', base:24, bullet:B2},
            {type:3, anims: 'e5_anims_3_', base:36, bullet:B3}
        ];

        super.init(type, pos);
        const typeInfo = type_defs.find(s => s.type === type);
        this.bullet = typeInfo.bullet;
        const base = typeInfo.base;
        this.anims = typeInfo.anims;
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_e5')
            .setOrigin(0.5, 0.5).setFrame(base);
        this.dir = GLOBALS.DIR.UP;

        // アニメーションデータの定義
        this.anim_defs = [
            {
                from_dir: GLOBALS.DIR.LEFT, to_dir: GLOBALS.DIR.UP,
                key: 'left_to_up',
                frames: [ { frame: base + 9 }, { frame: base + 10 }, { frame: base + 11 }, { frame: base + 0 } ],
                endFrame: base + 0
            },
            {
                from_dir: GLOBALS.DIR.LEFT, to_dir: GLOBALS.DIR.DOWN,
                key: 'left_to_down',
                frames: [ { frame: base + 9 }, { frame: base + 8 }, { frame: base + 7 }, { frame: base + 6 } ],
                endFrame: base + 6
            },
            {
                from_dir: GLOBALS.DIR.LEFT, to_dir: GLOBALS.DIR.RIGHT,
                key: 'left_to_right',
                frames: [ { frame: base + 9 }, { frame: base + 10 }, { frame: base + 11 }, { frame: base + 0 }, { frame: base + 1 }, { frame: base + 2 }, { frame: base + 3 } ],
                endFrame: base + 3
            },
            {
                from_dir: GLOBALS.DIR.UP, to_dir: GLOBALS.DIR.RIGHT,
                key: 'up_to_right',
                frames: [ { frame: base + 0 }, { frame: base + 1 }, { frame: base + 2 }, { frame: base + 3 } ],
                endFrame: base + 3
            },
            {
                from_dir: GLOBALS.DIR.UP, to_dir: GLOBALS.DIR.LEFT,
                key: 'up_to_left',
                frames: [ { frame: base + 0 }, { frame: base + 11 }, { frame: base + 10 }, { frame: base + 9 } ],
                endFrame: base + 9
            },
            {
                from_dir: GLOBALS.DIR.UP, to_dir: GLOBALS.DIR.DOWN,
                key: 'up_to_down',
                frames: [ { frame: base + 0 }, { frame: base + 1 }, { frame: base + 2 }, { frame: base + 3 }, { frame: base + 4 }, { frame: base + 5 }, { frame: base + 6 } ],
                endFrame: base + 6
            },
            {
                from_dir: GLOBALS.DIR.RIGHT, to_dir: GLOBALS.DIR.UP,
                key: 'right_to_up',
                frames: [ { frame: base + 3 }, { frame: base + 2 }, { frame: base + 1 }, { frame: base + 0 } ],
                endFrame: base + 0
            },
            {
                from_dir: GLOBALS.DIR.RIGHT, to_dir: GLOBALS.DIR.DOWN,
                key: 'right_to_down',
                frames: [ { frame: base + 3 }, { frame: base + 4 }, { frame: base + 5 }, { frame: base + 6 } ],
                endFrame: base + 6
            },
            {
                from_dir: GLOBALS.DIR.RIGHT, to_dir: GLOBALS.DIR.LEFT,
                key: 'right_to_left',
                frames: [ { frame: base +3 }, { frame: base + 4 }, { frame: base + 5 }, { frame: base + 6 }, { frame: base + 7 }, { frame: base + 8 }, { frame: base + 9 } ],
                endFrame: base + 9
            },
            {
                from_dir: GLOBALS.DIR.DOWN, to_dir: GLOBALS.DIR.LEFT,
                key: 'down_to_left',
                frames: [ { frame: base + 6 }, { frame: base + 7 }, { frame: base + 8 }, { frame: base + 9 } ],
                endFrame: base + 9
            },
            {
                from_dir: GLOBALS.DIR.DOWN, to_dir: GLOBALS.DIR.RIGHT,
                key: 'down_to_right',
                frames: [ { frame: base + 6 }, { frame: base + 5 }, { frame: base + 4 }, { frame: base + 3 } ],
                endFrame: base + 3
            },
            {
                from_dir: GLOBALS.DIR.DOWN, to_dir: GLOBALS.DIR.UP,
                key: 'down_to_up',
                frames: [ { frame: base + 6 }, { frame: base + 5 }, { frame: base + 4 }, { frame: base + 3 }, { frame: base + 2 }, { frame: base + 1 }, { frame: base + 0 } ],
                endFrame: base + 0
            }
        ];
    }

    set_dir(dir){
        this.sprite.setFrame(this.type * 12 + dir * 3);
        super.set_dir(dir);
    }

    update(){
        super.update();
    }

    _move(){
        if (this.state == ST_NORM){
            let result = RES_NORM;
            for (let i=0;i<this.speed;i++){
                const next_pos_x = this.pos.x + GLOBALS.DIR_X[this.dir];
                const next_pos_y = this.pos.y + GLOBALS.DIR_Y[this.dir];
                if ( MyMath.isOnPath(next_pos_x, next_pos_y) &&
                    !MyMath.isOnOuterFence(next_pos_x, next_pos_y, this.size)){
                    this.pos.x = next_pos_x;
                    this.pos.y = next_pos_y;
                    if (MyMath.isCenter(this.pos.x, this.pos.y)){
                        result = RES_CENTER;
                        break;
                    }
                } else {
                    result = RES_BLOCKED;
                    break;
                }
            }
            if (result === RES_CENTER){
                // パネル中心に来たら方向転換を計算
                const {loc_x : lpx, loc_y : lpy} = MyMath.get_loc_from_pos(GameState.player.pos.x, GameState.player.pos.y);
                const distances = this.compute_distances(lpx, lpy);
                const {loc_x : lex, loc_y : ley} = MyMath.get_loc_from_pos(this.pos.x, this.pos.y);
                const to_dir = this.compute_dir(distances, lex, ley);
                if ((to_dir != null) && this.dir != to_dir){
                    this.rotate_sprite(this.sprite, this.dir, to_dir);
                    this.state = ST_TURN;
                }
                // 弾の射出
                if (this.bullet){
                    // プレイヤーがいる方向に弾を射出
                    const dx = GameState.player.pos.x - this.pos.x;
                    const dy = GameState.player.pos.y - this.pos.y;
                    const dir = Math.abs(dx) > Math.abs(dy)
                      ? dx > 0 ? GLOBALS.DIR.RIGHT : GLOBALS.DIR.LEFT
                      : dy > 0 ? GLOBALS.DIR.DOWN : GLOBALS.DIR.UP;
                    super.shoot_bullet(dir);
                }
            } else if (result === RES_BLOCKED){
                // 進行方向に進めなければ方向を反転
                const to_dir = MyMath.invert_direction(this.dir);
                if (to_dir != null){
                    this.rotate_sprite(this.sprite, this.dir, to_dir);
                    this.state = ST_TURN;
                }
            }
        } else if (this.state == ST_TURN){
            // アニメーションの終了待ち
        }
        super._move();        
    }

    compute_distances(startCol, startRow) {
        const distances = Array(GameState.field_col).fill(null).map(() =>
            Array(GameState.field_row).fill(null)
        );
        const queue = [];
        distances[startCol][startRow] = 0;
        queue.push([startCol, startRow]);

        while (queue.length > 0) {
            const [col, row] = queue.shift();
            const d1 = distances[col][row];
            const p1 = GameState.panels[col][row];

            const directions = [
                { dc: 0, dr: -1, fence: 'top', oppositeFence: 'bottom' },
                { dc: 0, dr: 1, fence: 'bottom', oppositeFence: 'top' },
                { dc: -1, dr: 0, fence: 'left', oppositeFence: 'right' },
                { dc: 1, dr: 0, fence: 'right', oppositeFence: 'left' },
            ];

            for (const { dc, dr, fence, oppositeFence } of directions) {
                const nc = col + dc;
                const nr = row + dr;
                if (nc < 0 || nc >= GameState.field_col || nr < 0 || nr >= GameState.field_row) continue;

                const p2 = GameState.panels[nc][nr];
                if (!p1.fence[fence] && !p2.fence[oppositeFence]) {
                    const d2 = distances[nc][nr];
                    if (d2 === null || d2 > d1 + 1) {
                        distances[nc][nr] = d1 + 1;
                        queue.push([nc, nr]);
                    }
                }
            }
        }

        // console.log('distances', distances);
        return distances;
    }

    compute_dir(distances, loc_x, loc_y){
        const d = distances[loc_x][loc_y];
        if (d === null){
            return null;
        }
        if (d === 0){
            // 同じパネルにいる
            if (this.pos.x < GameState.player.pos.x){return GLOBALS.DIR.RIGHT}
            else if(this.pos.x > GameState.player.pos.x){return GLOBALS.DIR.LEFT}
            else if(this.pos.y < GameState.player.pos.y){return GLOBALS.DIR.DOWN}
            else if(this.pos.y > GameState.player.pos.y){return GLOBALS.DIR.UP}
        }
        let to_dir = null;
        if (loc_x < GameState.field_col - 1){
            const d1 = distances[loc_x + 1][loc_y];
            if (d1 == d - 1 && MyMath.isMovable(loc_x, loc_y, GLOBALS.DIR.RIGHT)){
                to_dir = GLOBALS.DIR.RIGHT;
            }
        }
        if (loc_y < GameState.field_row - 1){
            const d1 = distances[loc_x][loc_y + 1];
            if (d1 == d - 1 && MyMath.isMovable(loc_x, loc_y, GLOBALS.DIR.DOWN)){
                to_dir = GLOBALS.DIR.DOWN;
            }
        }
        if (loc_x > 0){
            const d1 = distances[loc_x - 1][loc_y];
            if (d1 == d - 1 && MyMath.isMovable(loc_x, loc_y, GLOBALS.DIR.LEFT)){
                to_dir = GLOBALS.DIR.LEFT;
            }
        }
        if (loc_y > 0){
            const d1 = distances[loc_x][loc_y - 1];
            if (d1 == d - 1 && MyMath.isMovable(loc_x, loc_y, GLOBALS.DIR.UP)){
                to_dir = GLOBALS.DIR.UP;
            }
        }

        // console.log("to_dir", to_dir);
        return to_dir;
    }

    rotate_sprite(sprite, from_dir, to_dir) {

        const animInfo = this.anim_defs.find(a => a.from_dir === from_dir && a.to_dir === to_dir);
        if (!animInfo) {
            console.warn(`No animation defined from ${from_dir} to ${to_dir}`);
            return;
        }

        // console.log("e5.anims",this.anims + animInfo.key);

        if (!sprite.scene.anims.exists(this.anims + animInfo.key)) {
            sprite.scene.anims.create({
                key: this.anims + animInfo.key,
                frames: animInfo.frames,
                frameRate: 8,
                repeat: 0,
                defaultTextureKey: 'ss_e5'
            });
        }

        sprite.on('animationcomplete', (animation) => {
            if (animation.key === this.anims + animInfo.key) {
                sprite.setFrame(animInfo.endFrame); // 回転後に最終フレームを静止表示
                sprite.off('animationcomplete'); // 多重登録防止
                this.state = ST_NORM;
                this.dir = animInfo.to_dir;
            }
        });
        sprite.play(this.anims + animInfo.key);
    }
}