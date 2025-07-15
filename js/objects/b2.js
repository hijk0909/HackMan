// b1.js
import { GLOBALS } from '../GameConst.js';
import { Bullet } from './bullet.js';
import { MyMath } from '../utils/MathUtils.js';

export class B2 extends Bullet {

    constructor(scene){
        super(scene);
        this.size = 16;
        this.speed = 6;
    }

    init(type, pos){
        super.init(type, pos);
        this.size = 24;

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_b2').setOrigin(0.5, 0.5);
        if (!this.scene.anims.exists('b2_anims')) {
            this.scene.anims.create({key:'b2_anims',
                frames: this.scene.anims.generateFrameNumbers('ss_b2', { start: 0, end: 3 }),
                frameRate: 4, repeat: -1
            });
        }
        this.sprite.play('b2_anims');
        
    }

    update(){
        const next_pos_x = this.pos.x + GLOBALS.DIR_X[this.dir] * this.speed;
        const next_pos_y = this.pos.y + GLOBALS.DIR_Y[this.dir] * this.speed;
        if ( !MyMath.isOnWall(next_pos_x, next_pos_y, this.size)){
            this.pos.x = next_pos_x;
            this.pos.y = next_pos_y;
        } else {
            this.alive = false;
        }
        super.update();
    }

    destroy(){
        super.destroy();
    }
}
