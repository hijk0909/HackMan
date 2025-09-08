// i3.js
// Launcher
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Item } from './item.js';
import { B1 } from './b1.js';
import { B2 } from './b2.js';
import { B3 } from './b3.js';

const BULLET_OFFSET= 31;
const FOCUS_COUNTDOWN = 100;
const FOCUS_THICK = 3;

export class I3 extends Item {

    constructor(scene){
        super(scene)
        // launcher用
        this.dir = GLOBALS.DIR.LEFT;
        this.bullet_x = 0;
        this.bullet_y = 0;
        this.cooldown = 0;
        this.cooldown_interval = 100;
        this.bullet = null;
        this.graphics = this.scene.add.graphics().setDepth(3);
        this.focus_color = 0xff0000;
    }

    init(wall, loc){
        super.init(wall, loc);
        if (wall === GLOBALS.WALL.TYPE.EAST){
            this.dir = GLOBALS.DIR.LEFT;
            this.bullet_x = - BULLET_OFFSET;
        } else if (wall === GLOBALS.WALL.TYPE.WEST){
            this.dir = GLOBALS.DIR.RIGHT;
            this.bullet_x = BULLET_OFFSET;
        } else if (wall === GLOBALS.WALL.TYPE.NORTH){
            this.dir = GLOBALS.DIR.DOWN;
            this.bullet_y = BULLET_OFFSET;
        } else if (wall === GLOBALS.WALL.TYPE.SOUTH){
            this.dir = GLOBALS.DIR.UP;
            this.bullet_y = - BULLET_OFFSET;
        }
        // Launcher用
        this.cooldonw = this.cooldown_interval;
    }

    set_type(type){
        super.set_type(type);

        // Launcher用
        if (type === GLOBALS.ITEM.TYPE.LAUNCHER_1){
            this.bullet = B1;
            this.cooldown_interval = 100;
            this.focus_color = 0xff0000;
        } else if (type === GLOBALS.ITEM.TYPE.LAUNCHER_2){
            this.bullet = B2;
            this.cooldown_interval = 300;
            this.focus_color = 0x0000ff;
        } else if (type === GLOBALS.ITEM.TYPE.LAUNCHER_3){
            this.bullet = B3;
            this.cooldown_interval = 150;
            this.focus_color = 0xffff00;
        } else if (type === GLOBALS.ITEM.TYPE.LAUNCHER_F){
            this.bullet = B1;
            this.cooldown_interval = 50;
            this.focus_color = 0xff0000;
        }
    }

    set_cooldown_interval(cooldown){
        this.cooldown_interval = cooldown;
    }

    // 発射台からの弾の発射
    shoot_bullet(){
        const b = new this.bullet(this.scene);
        b.init(0,new Phaser.Math.Vector2(this.pos.x + this.bullet_x, this.pos.y + this.bullet_y));
        b.set_dir(this.dir);
        GameState.bullets.push(b);
    }

    update(){
        // ◆弾発射台
        this.graphics.clear();
        if (this.type != GLOBALS.ITEM.TYPE.NONE){
            this.cooldown -= 1;
            if (this.cooldown <= 0){
                this.cooldown = this.cooldown_interval;
                this.shoot_bullet();
            }
            // 発射予告（focus）
            if (this.cooldown <= FOCUS_COUNTDOWN){
                const radius = this.cooldown;
                const alpha = Math.max(0, 1 - this.cooldown / FOCUS_COUNTDOWN);
                this.graphics.lineStyle(FOCUS_THICK, this.focus_color);
                this.graphics.strokeCircle(this.pos.x, this.pos.y, radius).setAlpha(alpha);
            }
        }
        super.update();
    }

    destroy(){
        if ( this.graphics ){
            this.graphics.destroy();
            this.graphics = null;
        }
        super.destroy();
    }
}