// e4.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';
import { B1 } from './b1.js';
import { B2 } from './b2.js';

const COOLDOWN_INTERVAL = 45;

export class E4 extends Enemy {

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

        const type_defs = [
            {type:0, anims: 'e4_anims_0', anims_start:0, anims_end:3,  bullet:null},
            {type:1, anims: 'e4_anims_1', anims_start:4, anims_end:7,  bullet:B1},
            {type:2, anims: 'e4_anims_2', anims_start:8, anims_end:11, bullet:B2},
        ];

        super.init(type, pos);
        const typeInfo = type_defs.find(s => s.type === type);
        this.bullet = typeInfo.bullet;

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_e4').setOrigin(0.5, 0.5)
            .setFrame(typeInfo.anims_start);
        if (!this.scene.anims.exists(typeInfo.anims)) {
            this.scene.anims.create({key:typeInfo.anims,
                frames: this.scene.anims.generateFrameNumbers('ss_e4',
                    { start: typeInfo.anims_start, end: typeInfo.anims_end }),
                frameRate: 8, repeat: -1
            });
        }
        this.sprite.play(typeInfo.anims);
    }

    update(){
        super.update();
    }

    _move(){
        // 移動
        for (let i=0;i<this.speed;i++){
            let dir = (this.dir + 1) % GLOBALS.DIR.NUM;
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
                dir = (dir - 1 + GLOBALS.DIR.NUM) % GLOBALS.DIR.NUM;
            }
        }
        // 弾の発射
        if (this.bullet){
            this.cooldown -= 1;
            if (this.cooldown <= 0){
                this.cooldown = COOLDOWN_INTERVAL;
                super.shoot_bullet(this.dir);
            }
        }
    }
}