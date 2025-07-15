// effect.js
import { GLOBALS } from '../GameConst.js';
import { Drawable } from './drawable.js';

export class Effect extends Drawable {

    constructor(scene){
        super(scene);
        this.sprites = [];
    }

    init(type, pos){
        this.type = type;
        this.pos = pos.clone();
        if (type == GLOBALS.EFFECT.TYPE.EXPLOSION){
            // 爆発エフェクト
            this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_expl').setOrigin(0.5, 0.5);
            if (!this.scene.anims.exists('expl_anims')) {
                this.scene.anims.create({key:'expl_anims',
                    frames: this.scene.anims.generateFrameNumbers('ss_expl', { start: 0, end: 7 }),
                    frameRate: 12, repeat: 0
                });
            }
            this.sprite.on('animationcomplete', (animation, frame) => {
                if (animation.key === 'expl_anims') {
                    this.alive = false;
                }
            });
            this.sprite.play('expl_anims');
        }
    }


    destroy(){
        super.destroy();
        if ( this.sprites ){
            for (let i=0;i<this.num;i++){
                this.sprites[i].destroy();
            }
            this.sprites = null;
        }
    }
}