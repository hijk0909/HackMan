// e1.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Effect } from './effect.js';
import { Enemy } from './enemy.js';

const ST_NORM = 0;
const ST_TURN = 1;

export class E2 extends Enemy {

    constructor(scene){
        super(scene);
        this.score = 0;
        this.size = 24;
        this.speed = 3;
        this.state = ST_NORM;
    }

    init(type, pos){
        super.init(type, pos);
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_e2')
            .setOrigin(0.5, 0.5).setFrame(0);
        this.dir = GLOBALS.DIR.DOWN;
}

    update(){
        super.update();
    }

    _move(){
        if (this.state == ST_NORM){
            if (!super.move_straight()){
                this.state = ST_TURN;
                this.dir = (this.dir == GLOBALS.DIR.UP) ? GLOBALS.DIR.DOWN : GLOBALS.DIR.UP;
                if (!this.scene.anims.exists('e2_anims')) {
                    this.scene.anims.create({key:'e2_anims',
                        frames: this.scene.anims.generateFrameNumbers('ss_e2', { start: 0, end: 4 }),
                        frameRate: 8, repeat: 0
                    });
                }
                this.sprite.on('animationcomplete', (animation, frame) => {
                    if (animation.key === 'e2_anims') {
                        this.state = ST_NORM;
                        this.sprite.setFrame(0);
                    }
                });
                this.sprite.play('e2_anims');
            }
        } else if (this.state == ST_TURN){
            // アニメーションの終了待ち
        }
        super._move();    
    }
}