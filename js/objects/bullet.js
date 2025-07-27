// bullet.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Movable } from './movable.js';
import { Effect } from './effect.js';

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
        if (!this.alive){
            const eff = new Effect(this.scene);
            eff.init(GLOBALS.EFFECT.TYPE.EXTINCTION,new Phaser.Math.Vector2(this.pos.x, this.pos.y));
            GameState.effects.push(eff);
        }
        super.update();
    }

    destroy(){
        super.destroy();
    }
}