// movable.js
import { GLOBALS } from "../GameConst.js";
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';
import { MyMath} from '../utils/MathUtils.js';

export class Movable extends Drawable {

    constructor(scene){
        super(scene);
        this.size = GLOBALS.MOVABLE.SIZE;
    }

    init(type, pos){
        super.init(type,pos);
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