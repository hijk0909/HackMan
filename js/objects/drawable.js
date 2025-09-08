// drawable.js

const SHADOW_OFFSET_X = 8;
const SHADOW_OFFSET_Y = 8;

export class Drawable {

    constructor(scene){
        this.scene = scene;
        this.pos = new Phaser.Math.Vector2(0, 0);
        this.type = null;
        this.offset = new Phaser.Math.Vector2(0,0);
        this.sprite = null;
        this.sprite_shadow = null;
        this.alive = true;
    }

    init(type, pos){
        this.type = type;
        this.pos = pos.clone();
    }

    set_pos(pos){
        this.pos = pos.clone(); // Phaser.Math.Vector2
    }

    set_shadow(){
        this.sprite_shadow = this.scene.add.sprite(
            this.sprite.x + SHADOW_OFFSET_X,
            this.sprite.y + SHADOW_OFFSET_Y,
            this.sprite.texture.key,
            this.sprite.frame.name)
        .setOrigin(this.sprite.originX, this.sprite.originY)
        .setTint(0x000000)
        .setAlpha(0.5)
        .setDepth(-1);
    }

    update(){
        if ( this.sprite ){
            this.sprite.setPosition(this.pos.x + this.offset.x, this.pos.y + this.offset.y);
        }
        if ( this.sprite_shadow ){
            this.sprite_shadow.setPosition(this.pos.x + this.offset.x + SHADOW_OFFSET_X, this.pos.y + this.offset.y + SHADOW_OFFSET_Y);
            this.sprite_shadow.setFrame(this.sprite.frame.name);
        }
    }

    destroy(){
        if ( this.sprite ){
            this.sprite.destroy();
            this.sprite = null;
        }
        if ( this.sprite_shadow ){
            this.sprite_shadow.destroy();
            this.sprite = null;
        }
        this.alive = false;
    }

    setAlive(alive) {
        this.alive = alive;
    }

    isAlive() {
        return this.alive;
    }

}