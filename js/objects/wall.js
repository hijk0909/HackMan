// wall.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';

export class Wall extends Drawable {

    constructor(scene){
        super(scene);
    }

    init(type, loc){
        super.init(type, loc);
        let x = GameState.field_origin_x;
        let y = GameState.field_origin_y;
        let key = null;
        if (type === GLOBALS.WALL.TYPE.EAST){
            x += GLOBALS.WALL.SIZE.THICK + loc.x * GLOBALS.PANEL.WIDTH * GLOBALS.FIELD.COL;
            y += GLOBALS.WALL.SIZE.THICK + loc.y * GLOBALS.PANEL.HEIGHT;
            key = "we";
        } else if (type === GLOBALS.WALL.TYPE.WEST){
            // x += loc.x * GLOBALS.PANEL.WIDTH * GLOBALS.FIELD.COL;
            y += GLOBALS.WALL.SIZE.THICK + loc.y * GLOBALS.PANEL.HEIGHT;
            key = "ww"
        } else if (type === GLOBALS.WALL.TYPE.NORTH){
            x += GLOBALS.WALL.SIZE.THICK + loc.x * GLOBALS.PANEL.WIDTH;
            // y += loc.y * GLOBALS.PANEL.HEIGHT * GLOBALS.FIELD.ROW;
            key = "wn";
        } else if (type === GLOBALS.WALL.TYPE.SOUTH){
            x += GLOBALS.WALL.SIZE.THICK + loc.x * GLOBALS.PANEL.WIDTH;
            y += GLOBALS.WALL.SIZE.THICK + loc.y * GLOBALS.PANEL.HEIGHT * GLOBALS.FIELD.ROW;
            key = "ws";
        } else if (type === GLOBALS.WALL.TYPE.CORNER){
            x += loc.x * (GLOBALS.WALL.SIZE.THICK + GLOBALS.PANEL.WIDTH * GLOBALS.FIELD.COL);
            y += loc.y * (GLOBALS.WALL.SIZE.THICK + GLOBALS.PANEL.HEIGHT * GLOBALS.FIELD.ROW);
            key = "wc"
        }
        this.pos.x = x;
        this.pos.y = y;
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, key).setOrigin(0,0);
    }

    update(){

    }

    destroy(){
        super.destroy();
    }

}