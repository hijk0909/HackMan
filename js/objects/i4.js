// i4.js
// Generator
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Item } from './item.js';
import { MyMath } from '../utils/MathUtils.js';
import { E1 } from './e1.js';
import { E2 } from './e2.js';
import { E3 } from './e3.js';
import { E4 } from './e4.js';
import { E5 } from './e5.js';

export class I4 extends Item {

    constructor(scene){
        super(scene)
        // generator用
        this.enemy = null;
        this.enemy_x = 0;
        this.enemy_y = 0;
        this.cooldown = 0;
        this.cooldown_interval = 100;
        this.generator_beams = [];
        this.isOneTime = false;
    }

    init(wall, loc){
        super.init(wall, loc);
        if (wall === GLOBALS.WALL.TYPE.EAST){
            this.dir = GLOBALS.DIR.LEFT;
            const {pos_x, pos_y} = MyMath.get_pos_from_loc(GameState.field_col - 1, loc);
            this.enemy_x = pos_x;
            this.enemy_y = pos_y;
        } else if (wall === GLOBALS.WALL.TYPE.WEST){
            this.dir = GLOBALS.DIR.RIGHT;
            const {pos_x, pos_y} = MyMath.get_pos_from_loc(0, loc);
            this.enemy_x = pos_x;
            this.enemy_y = pos_y;
        } else if (wall === GLOBALS.WALL.TYPE.NORTH){
            this.dir = GLOBALS.DIR.DOWN;
            const {pos_x, pos_y} = MyMath.get_pos_from_loc(loc, 0);
            this.enemy_x = pos_x;
            this.enemy_y = pos_y;
        } else if (wall === GLOBALS.WALL.TYPE.SOUTH){
            this.dir = GLOBALS.DIR.UP;
            const {pos_x, pos_y} = MyMath.get_pos_from_loc(loc, GameState.field_row - 1);
            this.enemy_x = pos_x;
            this.enemy_y = pos_y;
        }
    }

    set_type(type){
        super.set_type(type);

        // Generator用
        if (type === GLOBALS.ITEM.TYPE.GENERATOR_1){
            if (this.dir === GLOBALS.DIR.UP || this.dir === GLOBALS.DIR.DOWN){
                this.enemy = E2;
            } else if (this.dir === GLOBALS.DIR.LEFT || this.dir === GLOBALS.DIR.RIGHT){
                this.enemy = E1;
            }
            this.cooldown_interval = 415;
        } else if (type === GLOBALS.ITEM.TYPE.GENERATOR_2){
            if (this.dir === GLOBALS.DIR.UP || this.dir === GLOBALS.DIR.DOWN){
                this.enemy = E3;
            } else if (this.dir === GLOBALS.DIR.LEFT || this.dir === GLOBALS.DIR.RIGHT){
                this.enemy = E4;
            }
            this.cooldown_interval = 530;
        } else if (type === GLOBALS.ITEM.TYPE.GENERATOR_3){
            this.enemy = E5;
            this.cooldown_interval = 960;
        }
    }

    set_cooldown_interval(cooldown){
        this.cooldown_interval = cooldown;
    }

    // 発生器からの敵生成
    generate_enemy(){
        const e = new this.enemy(this.scene);
        e.init(0, new Phaser.Math.Vector2(this.enemy_x, this.enemy_y));
        e.set_dir(this.dir);
        e.set_generating();
        GameState.enemies.push(e);
    }

    // 生成ビーム演出の追加
    generate_beam(){
        const gb = new GeneratorBeam(this.scene);
        gb.init(this.pos, this.dir);
        this.generator_beams.push(gb);
    }

    update(){
        if (this.get_visible()){
            // console.log("I4.update", this.cooldown);
            if (this.type != GLOBALS.ITEM.TYPE.NONE){
                this.cooldown -= 1;
                if (this.cooldown <= 0){
                    this.cooldown = this.cooldown_interval;
                    this.generate_enemy();
                    this.generate_beam();
                    if (this.isOneTime){
                        // ワンタイム発生器の場合
                        this.set_blink_out();
                    }
                }
            }

            // ◆生成器ビーム演出の管理
            for (let i = this.generator_beams.length - 1; i >= 0; i--) {
                const gb = this.generator_beams[i];
                gb.update();
                if (!gb.isAlive()) {
                    gb.destroy();
                    this.generator_beams.splice(i, 1);
                }
            }
        }
        super.update();
    }

    destroy(){
        for (let i = this.generator_beams.length - 1; i >= 0; i--) {
            this.generator_beams[i].destroy();
            this.generator_beams.splice(i, 1);
        }
        super.destroy();
    }

}

// 生成器（Generator）のビーム演出

const BEAM_NUM = 10;
const BEAM_PERIOD = 10;
const BEAM_RADIUS_MAX = 48;
const BEAM_COLOR = 0x00ff00;
const BEAM_THICK = 4;
const BEAM_SPEED =3;

class GeneratorBeam{
    constructor(scene){
        this.scene = scene;
        this.repeat = 0;
        this.count = 0;
        this.beams = [];
        this.alive = true;
        this.pos = null;
        this.dir = null;
    }

    init(pos, dir){
        this.pos = pos.clone();
        this.dir = dir;
    }

    isAlive(){
        return this.alive;
    }

    update(){
        // BEAMの生成
        if (this.repeat <= BEAM_NUM){
            this.count -= 1;
            if (this.count <= 0){
                this.count = BEAM_PERIOD;
                this.repeat += 1;
                const b = new Beam(this.scene);
                const pos = this.pos.clone();
                b.init(pos, this.dir);
                this.beams.push(b);
            }
        }
        // BEAMの管理
        for (let i = this.beams.length - 1; i >= 0; i--) {
            const b = this.beams[i];
            b.draw();
            if (!b.isAlive()) {
                b.destroy();
                this.beams.splice(i, 1);
            }
        }
        if (this.beams.length === 0){
            this.alive = false;
        }
    }

    destroy(){
        for (let i = this.beams.length - 1; i >= 0; i--) {
            this.beams[i].destroy();
            this.beams.splice(i, 1);
        }
    }

}

class Beam{
    constructor(scene){
        this.scene = scene;
        this.graphics = this.scene.add.graphics().setDepth(3);
        this.radius = 1;
        this.alive = true;
        this.pos = null;
        this.dx = 0;
        this.dy = 0;
    }

    init(pos, dir){
        this.pos = pos;
        if (dir === GLOBALS.DIR.UP){
            this.dy = -BEAM_SPEED;
        } else if (dir === GLOBALS.DIR.DOWN){
            this.dy = BEAM_SPEED;
        } else if (dir === GLOBALS.DIR.RIGHT){
            this.dx = BEAM_SPEED;
        } else if (dir === GLOBALS.DIR.LEFT){
            this.dx = -BEAM_SPEED;
        }
    }

    isAlive(){
        return this.alive;
    }

    draw(){
        this.graphics.clear();
        this.radius += 2;
        this.pos.x += this.dx;
        this.pos.y += this.dy;
        const alpha = Math.max(0, 1 - this.radius / BEAM_RADIUS_MAX);
        this.graphics.lineStyle(BEAM_THICK, BEAM_COLOR);
        this.graphics.strokeCircle(this.pos.x, this.pos.y, this.radius).setAlpha(alpha);
        if (this.radius >= BEAM_RADIUS_MAX){
            this.alive = false;
        }
    }

    destroy(){
        if ( this.graphics ){
            this.graphics.destroy();
            this.graphics = null;
        }        
    }
}