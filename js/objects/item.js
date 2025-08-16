// item.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';
import { B1 } from './b1.js';
import { B2 } from './b2.js';
import { B3 } from './b3.js';

const GENERATE_OFFSET = 31;

export class Item extends Drawable {

    constructor(scene){
        super(scene);
        // 宝箱用
        this.inner_type = GLOBALS.ITEM.TYPE.NONE;
        // launcher用
        this.dir = GLOBALS.DIR.LEFT;
        this.offset_x = 0;
        this.offset_y = 0;
        this.cooldown = 0;
        this.cooldown_interval = 100;
        this.bullet = null;
    }

    init(type, loc){
        super.init(type, loc);
        let x = GameState.field_origin_x + GameState.field_offset_x;
        let y = GameState.field_origin_y + GameState.field_offset_y;
        if (type === GLOBALS.WALL.TYPE.EAST){
            x += GLOBALS.WALL.SIZE.THICK + loc.x * GLOBALS.PANEL.WIDTH * GameState.field_col
                 + GLOBALS.ITEM.SIZE / 2;
            y += GLOBALS.WALL.SIZE.THICK + loc.y * GLOBALS.PANEL.HEIGHT + GLOBALS.PANEL.HEIGHT / 2;
            this.dir = GLOBALS.DIR.LEFT;
            this.offset_x = - GENERATE_OFFSET;
        } else if (type === GLOBALS.WALL.TYPE.WEST){
            x += GLOBALS.WALL.SIZE.THICK - GLOBALS.ITEM.SIZE / 2;
            y += GLOBALS.WALL.SIZE.THICK + loc.y * GLOBALS.PANEL.HEIGHT + GLOBALS.PANEL.HEIGHT / 2;
            this.dir = GLOBALS.DIR.RIGHT;
            this.offset_x = GENERATE_OFFSET;
        } else if (type === GLOBALS.WALL.TYPE.NORTH){
            x += GLOBALS.WALL.SIZE.THICK + loc.x * GLOBALS.PANEL.WIDTH
                 + GLOBALS.PANEL.WIDTH / 2;
            y += GLOBALS.WALL.SIZE.THICK - GLOBALS.ITEM.SIZE / 2;
            this.dir = GLOBALS.DIR.DOWN;
            this.offset_y = GENERATE_OFFSET;
        } else if (type === GLOBALS.WALL.TYPE.SOUTH){
            x += GLOBALS.WALL.SIZE.THICK + loc.x * GLOBALS.PANEL.WIDTH
                 + GLOBALS.PANEL.WIDTH / 2;
            y += GLOBALS.WALL.SIZE.THICK + loc.y * GLOBALS.PANEL.HEIGHT * GameState.field_row
                 + GLOBALS.ITEM.SIZE / 2;
            this.dir = GLOBALS.DIR.UP;
            this.offset_y = - GENERATE_OFFSET;
        }
        this.pos.x = x;
        this.pos.y = y;
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_icon').setOrigin(0.5, 0.5);
        this.sprite.setFrame(GLOBALS.ITEM.TYPE.NONE).setVisible(false);
        this.type = GLOBALS.ITEM.TYPE.NONE;
        // 宝箱用
        this.inner_type = GLOBALS.ITEM.TYPE.NONE;
        // Launcher用
        this.cooldonw = this.cooldown_interval;
    }

    set_type(type){
        this.type = type;
        this.sprite.setFrame(type);

        // Launcher用
        if (type === GLOBALS.ITEM.TYPE.LAUNCHER_1){
            this.bullet = B1;
        } else if (type === GLOBALS.ITEM.TYPE.LAUNCHER_2){
            this.bullet = B2;
        } else if (type === GLOBALS.ITEM.TYPE.LAUNCHER_3){
            this.bullet = B3;
        } else if (type === GLOBALS.ITEM.TYPE.LAUNCHER_F){
            this.bullet = B1;
        }
    }

    set_inner_type(type){
        this.inner_type = type;
    }

    set_cooldown_interval(cooldown){
        this.cooldown_interval = cooldown;
    }

    set_blink_out(){
        this.type = GLOBALS.ITEM.TYPE.NONE;
        this.scene.tweens.add({targets: this.sprite,
            alpha: { from: 1, to: 0.4 },
            duration: 160,
            repeat: 6,
            onComplete: () => {
                this.sprite.setFrame(GLOBALS.ITEM.TYPE.NONE).setAlpha(1);
            }
        });
    }

    set_visible(visible){
        this.sprite.setVisible(visible);
    }

    shoot_bullet(){
        const b = new this.bullet(this.scene);
        b.init(0,new Phaser.Math.Vector2(this.pos.x + this.offset_x, this.pos.y + this.offset_y));
        b.set_dir(this.dir);
        GameState.bullets.push(b);
    }

    update(){
        if (this.type >= GLOBALS.ITEM.TYPE.LAUNCHER_MIN && this.type <= GLOBALS.ITEM.TYPE.LAUNCHER_MAX){
            this.cooldonw -= 1;
            if (this.cooldonw <= 0){
                this.cooldonw = this.cooldown_interval;
                this.shoot_bullet();
            }
        }
    }

    destroy(){
        super.destroy();
    }

}