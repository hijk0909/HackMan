// movable.js
import { GLOBALS } from "../GameConst.js";
import { Drawable } from './drawable.js';

export class Movable extends Drawable {

    constructor(scene){
        super(scene);
        this.size = GLOBALS.MOVABLE.SIZE;
        this.dir = GLOBALS.DIR.RIGHT;
    }

    init(type, pos){
        super.init(type,pos);
    }

    set_dir(dir){
        this.dir = dir;
    }

    set_pos(pos){
        super.set_pos(pos);
    }

    update(){
        super.update();
    }

    destroy(){
        super.destroy();
    }
}