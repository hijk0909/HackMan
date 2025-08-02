// cursor.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';

export class Cursor extends Drawable {

    constructor(scene){
        super(scene);
        this.visible = false;
    }

    init(type, pos) {
        super.init(type, pos);       
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, "cursor")
            .setOrigin(0.5,0.5) .setVisible(false) .setAlpha(0.9);
        this.sprite_ns = this.scene.add.sprite(this.pos.x, this.pos.y, "cursor2").setOrigin(0,0)
            .setOrigin(0.5,0.5) .setVisible(false) .setAlpha(0.9);
        this.sprite_ew = this.scene.add.sprite(this.pos.x, this.pos.y, "cursor2").setOrigin(0,0)
            .setOrigin(0.5,0.5) .setVisible(false) .setAlpha(0.9);
        this.sprite_ew.angle = 90;
    }

    adjust(pos_x, pos_y){
        const fox = GameState.field_origin_x + GameState.field_offset_x;
        const foy = GameState.field_origin_y + GameState.field_offset_y;
        const wt = GLOBALS.WALL.SIZE.THICK;
        const fx = pos_x - fox - wt;
        const fy = pos_y - foy - wt;
        const pw = GLOBALS.PANEL.WIDTH;
        const ph = GLOBALS.PANEL.HEIGHT;
        const fc = GameState.field_col;
        const fr = GameState.field_row;
        if (pos_x > fox && pos_x < fox + wt && fy > 0 && fy < ph * fr){
            // 壁-西側
            if (this.visible){
                this.sprite.setVisible(false);
                this.sprite_ns.setVisible(false);
                this.sprite_ew.setVisible(true);
            }
            this.pos.x = fox + wt / 2;
            this.pos.y = foy + wt + Math.floor(fy / ph) * ph + ph / 2;
            this.sprite_ew.setPosition(this.pos.x, this.pos.y);
        } else if ( fx > pw * fc && fx < pw * fc + wt && fy > 0 && fy < ph * fr){
            // 壁-東側
            if (this.visible){
                this.sprite.setVisible(false);
                this.sprite_ns.setVisible(false);
                this.sprite_ew.setVisible(true);
            }
            this.pos.x = fox + wt + pw * fc + wt / 2;
            this.pos.y = foy + wt + Math.floor(fy / ph) * ph + ph / 2;
            this.sprite_ew.setPosition(this.pos.x, this.pos.y);
        } else if ( pos_y > foy && pos_y < foy + wt && fx > 0 && fx < pw * fc){
            // 壁-北側 
            if (this.visible){
                this.sprite.setVisible(false);
                this.sprite_ns.setVisible(true);
                this.sprite_ew.setVisible(false);
            }
            this.pos.x = fox + wt + Math.floor(fx / pw) * pw + pw / 2;
            this.pos.y = foy + wt / 2;
            this.sprite_ns.setPosition(this.pos.x, this.pos.y);
        } else if ( fy > ph * fr && fy < ph * fr + wt && fx >0 && fx < pw * fc){
            // 壁-南側
            if (this.visible){
                this.sprite.setVisible(false);
                this.sprite_ns.setVisible(true);
                this.sprite_ew.setVisible(false);
            }
            this.pos.x = fox + wt + Math.floor(fx / pw) * pw + pw / 2;
            this.pos.y = foy + ph * fr + wt + wt / 2;
            this.sprite_ns.setPosition(this.pos.x, this.pos.y);
        } else if ( fx > 0 && fx < pw * fc && fy > 0 && fy < ph * fr){
            // フィールド内
            if (this.visible){
                this.sprite.setVisible(true);
                this.sprite_ns.setVisible(false);
                this.sprite_ew.setVisible(false);
            }
            this.pos.x = fox + wt + Math.floor(fx / pw) * pw + pw / 2;
            this.pos.y = foy + wt + Math.floor(fy / ph) * ph + ph / 2;
            this.sprite.setPosition(this.pos.x, this.pos.y);
        } else {
            this.hide();
        }
    }

    update(){
        // super.update();
    }

    show(){
        this.visible = true;
    }

    hide(){
        this.sprite.setVisible(false);
        this.sprite_ns.setVisible(false);
        this.sprite_ew.setVisible(false);          
        this.visible = false; 
    }

    destroy(){
        if (this.sprite){
            this.sprite.destroy();
            this.sprite = null;            
        }
        if (this.sprite_ns){
            this.sprite_ns.destroy();
            this.sprite_ns = null;
        }
        if (this.sprite_ew){
            this.sprite_ew.destroy();
            this.sprite_ew = null;
        }
        // super.destroy();
    }
}