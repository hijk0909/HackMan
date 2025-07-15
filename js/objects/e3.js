// e3.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';
import { B1 } from './b1.js';

const COOLDOWN_INTERVAL = 45;

export class E3 extends Enemy {

    constructor(scene){
        super(scene);
        this.score = 0;
        this.size = 24;
        this.dir = GLOBALS.DIR.RIGHT;
        this.flip_state = GLOBALS.FLIP_STATE.NONE;
        this.parent_panel = null;
        this.cooldown = COOLDOWN_INTERVAL;
        this.speed = 4;
    }

    init(type, pos){
        super.init(type, pos);

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_e3').setOrigin(0.5, 0.5);
        if (!this.scene.anims.exists('e3_anims')) {
            this.scene.anims.create({key:'e3_anims',
                frames: this.scene.anims.generateFrameNumbers('ss_e3', { start: 0, end: 3 }),
                frameRate: 8, repeat: -1
            });
        }
        this.sprite.play('e3_anims');
    }

    update(){
        super.update();
    }

    _move(){
        // 移動
        for (let i=0;i<this.speed;i++){
            let dir = (this.dir - 1 + GLOBALS.DIR.NUM) % GLOBALS.DIR.NUM;
            for (let i = 0 ; i < GLOBALS.DIR.NUM ; i++){
                const next_pos_x = this.pos.x + GLOBALS.DIR_X[dir];
                const next_pos_y = this.pos.y + GLOBALS.DIR_Y[dir];
                if ( MyMath.isOnPath(next_pos_x, next_pos_y) &&
                    !MyMath.isOnOuterFence(next_pos_x, next_pos_y, this.size)){
                    this.dir = dir;
                    this.pos.x = next_pos_x;
                    this.pos.y = next_pos_y;
                    break;
                }
                dir = (dir + 1) % GLOBALS.DIR.NUM;
            }
        }
        // 弾の発射
        this.cooldown -= 1;
        if (this.cooldown <= 0){
            this.cooldown = COOLDOWN_INTERVAL;
            const b1 = new B1(this.scene);
            b1.init(0,new Phaser.Math.Vector2(this.pos.x, this.pos.y));
            b1.set_dir(this.dir);
            GameState.bullets.push(b1);
        }
    }
}