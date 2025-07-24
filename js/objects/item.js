// item.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';

export class Item extends Drawable {

    constructor(scene){
        super(scene);
    }

    init(type, loc){
        super.init(type, loc);
        let x = GameState.field_origin_x;
        let y = GameState.field_origin_y;
        if (type === GLOBALS.WALL.TYPE.EAST){
            x += GLOBALS.WALL.SIZE.THICK + loc.x * GLOBALS.PANEL.WIDTH * GLOBALS.FIELD.COL
                 + GLOBALS.ITEM.SIZE / 2;
            y += GLOBALS.WALL.SIZE.THICK + loc.y * GLOBALS.PANEL.HEIGHT + GLOBALS.PANEL.HEIGHT / 2;
        } else if (type === GLOBALS.WALL.TYPE.WEST){
            x += GLOBALS.WALL.SIZE.THICK - GLOBALS.ITEM.SIZE / 2;
            y += GLOBALS.WALL.SIZE.THICK + loc.y * GLOBALS.PANEL.HEIGHT + GLOBALS.PANEL.HEIGHT / 2;;
        } else if (type === GLOBALS.WALL.TYPE.NORTH){
            x += GLOBALS.WALL.SIZE.THICK + loc.x * GLOBALS.PANEL.WIDTH
                 + GLOBALS.PANEL.WIDTH / 2;
            y += GLOBALS.WALL.SIZE.THICK - GLOBALS.ITEM.SIZE / 2;
        } else if (type === GLOBALS.WALL.TYPE.SOUTH){
            x += GLOBALS.WALL.SIZE.THICK + loc.x * GLOBALS.PANEL.WIDTH
                 + GLOBALS.PANEL.WIDTH / 2;
            y += GLOBALS.WALL.SIZE.THICK + loc.y * GLOBALS.PANEL.HEIGHT * GLOBALS.FIELD.ROW
                 + GLOBALS.ITEM.SIZE / 2;
        }
        this.pos.x = x;
        this.pos.y = y;
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_icon').setOrigin(0.5, 0.5);
        this.sprite.setFrame(GLOBALS.ITEM.TYPE.NONE).setVisible(false);
        this.type = GLOBALS.ITEM.TYPE.NONE;
        this.inner_type = GLOBALS.ITEM.TYPE.NONE;
    }

    set_type(type){
        this.type = type;
        this.sprite.setFrame(type);
    }

    set_inner_type(type){
        this.inner_type = type;
    }

    set_blink_out(){
        this.type = GLOBALS.ITEM.TYPE.NONE;
        this.scene.tweens.add({targets: this.sprite,
            alpha: { from: 1, to: 0 },
            duration: 250,
            repeat: 5,
            onComplete: () => {
                this.sprite.setFrame(GLOBALS.ITEM.TYPE.NONE).setAlpha(1);
            }
        });
    }

    set_visible(visible){
        this.sprite.setVisible(visible);
    }

    update(){
    }

    destroy(){
        super.destroy();
    }

}