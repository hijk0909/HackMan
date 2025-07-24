// drawable.js

export class Drawable {

    constructor(scene){
        this.scene = scene;
        this.pos = new Phaser.Math.Vector2(0, 0);
        this.type = null;
        this.offset = new Phaser.Math.Vector2(0,0);
        this.sprite = null;
        this.alive = true;
    }

    init(type, pos){
        this.type = type;
        this.pos = pos.clone();
    }

    set_pos(pos){
        this.pos = pos.clone(); // Phaser.Math.Vector2
    }

    update(){
        if ( this.sprite ){
            this.sprite.setPosition(this.pos.x + this.offset.x, this.pos.y + this.offset.y);
        }
    }

    destroy(){
        if ( this.sprite ){
            this.sprite.destroy();
            this.sprite = null;
        }
        this.alive = false;
    }

    isAlive() {
        return this.alive;
    }

}