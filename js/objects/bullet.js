// bullet.js
import { GLOBALS } from '../GameConst.js';
import { Movable } from './movable.js';

export class Bullet extends Movable {

    constructor(scene){
        super(scene);
        this.dir = GLOBALS.DIR.RIGHT;
    }

    init(type, pos){
        super.init(type, pos);
    }

    set_dir(dir){
        this.dir = dir;
        if (dir == GLOBALS.DIR.DOWN){
            this.sprite.angle = 90;
        } else if (dir == GLOBALS.DIR.LEFT){
            this.sprite.angle = 180;
        } else if (dir == GLOBALS.DIR.UP){
            this.sprite.angle = 270;
        }
    }

    update(){
        super.update();
    }

    destroy(){
        super.destroy();
    }
}