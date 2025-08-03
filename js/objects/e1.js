// e1.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Enemy } from './enemy.js';
import { B1 } from './b1.js';
import { B2 } from './b2.js';
import { B3 } from './b3.js';

const ST_NORM = 0;
const ST_TURN = 1;
const COOLDOWN_INTERVAL = 20;

export class E1 extends Enemy {

    constructor(scene){
        super(scene);
        this.score = 0;
        this.size = 24;
        this.speed = 3;
        this.state = ST_NORM;
        this.bullet = null;
        this.cooldown = COOLDOWN_INTERVAL;
    }

    init(type, pos){

        const type_defs = [
            {type:0, anims: 'e1_anims_0', anims_start:0, anims_end:4,  bullet:null},
            {type:1, anims: 'e1_anims_1', anims_start:5, anims_end:9,  bullet:B1},
            {type:2, anims: 'e1_anims_2', anims_start:10, anims_end:14, bullet:B2},
            {type:3, anims: 'e1_anims_3', anims_start:15, anims_end:19, bullet:B3},
        ];

        super.init(type, pos);
        const typeInfo = type_defs.find(s => s.type === type);
        this.bullet = typeInfo.bullet;
        this.anims = typeInfo.anims;
        this.anims_start = typeInfo.anims_start;
        this.anims_end = typeInfo.anims_end;

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_e1')
            .setOrigin(0.5, 0.5).setFrame(this.anims_start);
        this.dir = GLOBALS.DIR.RIGHT;
    }

    set_dir(dir){
        this.sprite.setFrame(this.type * 5);
        super.set_dir(dir);
    }

    update(){
        super.update();
    }

    _move(){
        if (this.state == ST_NORM){
            // 通常移動
            if (!super.move_straight()){
                this.state = ST_TURN;
                this.dir = (this.dir == GLOBALS.DIR.RIGHT) ? GLOBALS.DIR.LEFT : GLOBALS.DIR.RIGHT;
                if (!this.scene.anims.exists(this.anims)) {
                    this.scene.anims.create({key:this.anims,
                        frames: this.scene.anims.generateFrameNumbers('ss_e1', { start: this.anims_start, end: this.anims_end }),
                        frameRate: 8, repeat: 0
                    });
                }
                this.sprite.on('animationcomplete', (animation, frame) => {
                    if (animation.key === this.anims) {
                        this.state = ST_NORM;
                        this.sprite.setFrame(this.anims_start);
                    }
                });
                this.sprite.play(this.anims);
            }

        } else if (this.state == ST_TURN){
            // 回転中（アニメーションの終了待ち）
        }
        super._move();        
    }

    _onCenter(){
        if (this.bullet){
            // 進行方向と直角で、プレイヤーがいる方向に弾を射出
            let dir = GLOBALS.DIR.UP;
            if (GameState.player.pos.y > this.pos.y){
                dir = GLOBALS.DIR.DOWN;
            }
            super.shoot_bullet(dir);
        }
    }
}