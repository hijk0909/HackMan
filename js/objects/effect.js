// effect.js
import { GLOBALS } from '../GameConst.js';
import { Drawable } from './drawable.js';

const EFF_PERIOD_TEXT =120;
const EFF_PERIOD_LASER =45;
const EFF_PERIOD_LASER_RANDOM = 30;

export class Effect extends Drawable {

    constructor(scene){
        super(scene);
        this.sprites = [];
        this.text = null;
        this.counter = EFF_PERIOD_TEXT;
        this.graphics = this.scene.add.graphics().setDepth(3);
        this.target_pos = null;
    }

    init(type, pos){
        this.type = type;
        this.pos = pos.clone();
        if (type === GLOBALS.EFFECT.TYPE.EXPLOSION){
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
            //(仮)パーティクル
            this.set_particle();
        } else if (type === GLOBALS.EFFECT.TYPE.EXTINCTION){
            // 消滅エフェクト（弾が壁に当たった時など）
            this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_expl').setOrigin(0.5, 0.5);
            if (!this.scene.anims.exists('extn_anims')) {
                this.scene.anims.create({key:'extn_anims',
                    frames: this.scene.anims.generateFrameNumbers('ss_expl', { start: 8, end: 15 }),
                    frameRate: 16, repeat: 0
                });
            }
            this.sprite.on('animationcomplete', (animation, frame) => {
                if (animation.key === 'extn_anims') {
                    this.alive = false;
                }
            });
            this.sprite.play('extn_anims');
        } else if (type === GLOBALS.EFFECT.TYPE.TEXT){
            // テキスト表示エフェクト
            this.counter = EFF_PERIOD_TEXT;
        } else if (type === GLOBALS.EFFECT.TYPE.LASER){
            // レーザー表示エフェクト
            this.counter = EFF_PERIOD_LASER + Math.floor(Math.random() * EFF_PERIOD_LASER_RANDOM);
        }
    }

    set_text(txt) {
        this.text = txt;
        this.textObject = this.scene.add.text(this.pos.x, this.pos.y, this.text, {
            fontFamily: 'Helvetica, Arial',
            fontSize: '28px',
            color: '#ffeedd',
            stroke: '#ff0000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);
    }

    set_particle(){
        if (!this.scene.textures.exists('img_exp')){
            let graphics = this.scene.add.graphics();
            graphics.fillStyle(0xff7000, 1);
            graphics.beginPath();
            let ox = 20;
            let oy = 20;
            graphics.moveTo(0 + ox, -20 + oy);
            graphics.lineTo(4 + ox, -4 + oy);
            graphics.lineTo(20 + ox, 0 + oy);
            graphics.lineTo(4 + ox, 4 + oy);
            graphics.lineTo(0 + ox, 20 + oy);
            graphics.lineTo(-4 + ox, 4 + oy);
            graphics.lineTo(-20 + ox, 0 + oy);
            graphics.lineTo(-4 + ox, -4 + oy);
            graphics.closePath();
            graphics.fillPath();
            graphics.generateTexture('img_expl', 40, 40);
            graphics.destroy();
        }
        this.emitter = this.scene.add.particles(0, 0, 'img_expl',{
            speed: { min: 160, max: 200 },
            scale: { start: 1, end: 0.5 },
            alpha: { start: 1, end: 0 },
            lifespan: 500,
            blendMode: 'ADD',
            quantity: 60 // 一度に何個放出するか
        });
        this.emitter.explode(60, this.pos.x, this.pos.y); 
    }

    set_target_pos(pos){
        this.target_pos = pos.clone();
        this.draw_laser(1);
    }

    draw_laser(alpha){
        this.graphics.clear(); 
        this.graphics.lineStyle(6, 0xff0000, alpha);
        this.graphics.beginPath();
        this.graphics.moveTo(this.pos.x, this.pos.y);
        this.graphics.lineTo(this.target_pos.x, this.target_pos.y);
        this.graphics.strokePath();
    }

    update(){
        if (this.type === GLOBALS.EFFECT.TYPE.TEXT){
            const t = EFF_PERIOD_TEXT - this.counter;
            this.textObject.setPosition(this.pos.x, getBouncingY(t, this.pos.y, 30, 80));
            const dur = 20;
            if ( this.counter < dur ){
                const r = dur - this.counter;
                this.textObject.setScale(1 + r/dur);
                this.textObject.setAlpha(this.counter/dur);
            }
            this.counter -= 1;
            if (this.counter <= 0){
                this.alive = false;
            }
        } else if (this.type === GLOBALS.EFFECT.TYPE.LASER){
            const alpha = ((this.counter & 2) === 0) ? 0 : Math.min(1,this.counter / EFF_PERIOD_LASER);
            this.draw_laser(alpha);
            this.counter -= 1;
            if (this.counter <= 0){
                this.alive = false;
            }
        }
    }

    destroy(){
        super.destroy();
        if ( this.textObject ){
            this.textObject.destroy();
            this.textObject = null;
        }
        if ( this.sprites ){
            for (let i=0;i<this.num;i++){
                this.sprites[i].destroy();
            }
            this.sprites = null;
        }
        if ( this.emitter ){
            this.emitter.destroy();
            this.emitter = null;
        }
        if ( this.graphics ){
            this.graphics.destroy();
            this.graphics = null;
        }
    }
}

function getBouncingY(t, Y0, DY, T) {
    if (t >= T) return Y0;

    let timePassed = 0;
    let duration = T / 2;
    let height = DY;
    let cycle = 0;

    // 各バウンドのフェーズを探す
    while (t > timePassed + duration) {
        timePassed += duration;
        duration /= 2;
        height /= 2;
        cycle++;
    }

    // 現在のバウンド内での進行度（0～1）
    let localT = (t - timePassed) / duration;

    // 放物線を描く： y = -4h * (x - 0.5)^2 + h
    let offset = -4 * height * Math.pow(localT - 0.5, 2) + height;

    return Y0 - offset;
}