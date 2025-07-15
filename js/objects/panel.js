// Panel.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';

export class Panel extends Drawable {

    constructor(scene){
        super(scene);
        this.fence = {
            top: false,
            bottom: false,
            left: false,
            right: false
        };
        this.state = GLOBALS.PANEL.STATE.NORMAL;
        this.flip_pair = null;
    }

    init(type, loc){
        super.init(type, loc);
        this.fence.top = (type & 1) !== 0;
        this.fence.bottom = (type & 2) !== 0;
        this.fence.left = (type & 4) !== 0;
        this.fence.right = (type & 8) !== 0;
        // const panel_key = `p${String(type).padStart(2, '0')}`
        this.pos.x = GameState.field_origin_x + GLOBALS.WALL.SIZE.THICK + loc.x * GLOBALS.PANEL.WIDTH;
        this.pos.y = GameState.field_origin_y + GLOBALS.WALL.SIZE.THICK + loc.y * GLOBALS.PANEL.HEIGHT;
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_panel').setOrigin(0,0).setFrame(type);
    }

    set_flip(dir,state){
        this.dir = dir;
        this.state = state;
        if (dir == GLOBALS.DIR.UP){
            this.target = this.pos.y - GLOBALS.PANEL.HEIGHT;
        } else if (dir == GLOBALS.DIR.DOWN){
            this.target = this.pos.y + GLOBALS.PANEL.HEIGHT;
        } else if (dir == GLOBALS.DIR.LEFT){
            this.target = this.pos.x - GLOBALS.PANEL.WIDTH;
        } else if (dir == GLOBALS.DIR.RIGHT){
            this.target = this.pos.x + GLOBALS.PANEL.WIDTH;
        }
    }

    update(){
        const prev_x = this.pos.x;
        const prev_y = this.pos.y;
        if (this.state == GLOBALS.PANEL.STATE.FLIP_ABOVE ||
            this.state == GLOBALS.PANEL.STATE.FLIP_BELOW ){
            if (this.dir == GLOBALS.DIR.UP){
                this.pos.y -= GameState.flip_speed;
                if (this.pos.y <= this.target){
                    this.pos.y = this.target;
                    this.state = GLOBALS.PANEL.STATE.NORMAL;
                }
            } else if (this.dir == GLOBALS.DIR.DOWN){
                this.pos.y += GameState.flip_speed;
                if (this.pos.y >= this.target){
                    this.pos.y = this.target;
                    this.state = GLOBALS.PANEL.STATE.NORMAL;
                }
            } else if (this.dir == GLOBALS.DIR.LEFT){
                this.pos.x -= GameState.flip_speed;
                if (this.pos.x <= this.target){
                    this.pos.x = this.target;
                    this.state = GLOBALS.PANEL.STATE.NORMAL;
                }
            } else if (this.dir == GLOBALS.DIR.RIGHT){
                this.pos.x += GameState.flip_speed;
                if (this.pos.x >= this.target){
                    this.pos.x = this.target;
                    this.state = GLOBALS.PANEL.STATE.NORMAL;
                }
            }
        }
        this.dx = this.pos.x - prev_x;
        this.dy = this.pos.y - prev_y;
        this.sprite.setTint(0xff0000);

        let c;
        if (this.state == GLOBALS.PANEL.STATE.FLIP_ABOVE){
            c = GLOBALS.COLOR.PANEL_ABOVE;
        } else if (this.state == GLOBALS.PANEL.STATE.FLIP_BELOW){
            c = GLOBALS.COLOR.PANEL_BELOW;
        } else if (this.state == GLOBALS.PANEL.STATE.READY){
            c = GLOBALS.COLOR.PANEL_READY;
        } else {
            c = GLOBALS.COLOR.PANEL_NORMAL;            
        }
        this.sprite.setTint(c);
        super.update();
    } // End of update

    destroy(){
        super.destroy();
    }
}