// item.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';

const BLINK_COUNTS = [120, 5, 5, 5];

export class Item extends Drawable {

    constructor(scene){
        super(scene);
        this.isBlinking = false;
        this.blink_count = 0;
        this.blink_index = 0;
    }

    init(wall, loc){
        let x = GameState.field_origin_x + GameState.field_offset_x;
        let y = GameState.field_origin_y + GameState.field_offset_y;
        if (wall === GLOBALS.WALL.TYPE.EAST){
            x += GLOBALS.WALL.SIZE.THICK + GLOBALS.PANEL.WIDTH * GameState.field_col
                 + GLOBALS.ITEM.SIZE / 2;
            y += GLOBALS.WALL.SIZE.THICK + loc * GLOBALS.PANEL.HEIGHT + GLOBALS.PANEL.HEIGHT / 2;
        } else if (wall === GLOBALS.WALL.TYPE.WEST){
            x += GLOBALS.WALL.SIZE.THICK - GLOBALS.ITEM.SIZE / 2;
            y += GLOBALS.WALL.SIZE.THICK + loc * GLOBALS.PANEL.HEIGHT + GLOBALS.PANEL.HEIGHT / 2;
        } else if (wall === GLOBALS.WALL.TYPE.NORTH){
            x += GLOBALS.WALL.SIZE.THICK + loc * GLOBALS.PANEL.WIDTH
                 + GLOBALS.PANEL.WIDTH / 2;
            y += GLOBALS.WALL.SIZE.THICK - GLOBALS.ITEM.SIZE / 2;
        } else if (wall === GLOBALS.WALL.TYPE.SOUTH){
            x += GLOBALS.WALL.SIZE.THICK + loc * GLOBALS.PANEL.WIDTH
                 + GLOBALS.PANEL.WIDTH / 2;
            y += GLOBALS.WALL.SIZE.THICK + GLOBALS.PANEL.HEIGHT * GameState.field_row
                 + GLOBALS.ITEM.SIZE / 2;
        }
        this.pos.x = x;
        this.pos.y = y;
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_icon').setOrigin(0.5, 0.5);
        this.sprite.setFrame(GLOBALS.ITEM.TYPE.NONE).setVisible(false);
        this.type = GLOBALS.ITEM.TYPE.NONE;
    }

    init2(index){
        let wall, loc;
        if (index < GameState.field_col){
            wall = GLOBALS.WALL.TYPE.NORTH;
            loc = index;
        } else if (index < GameState.field_col * 2){
            wall = GLOBALS.WALL.TYPE.SOUTH;
            loc = index - GameState.field_col;
        } else if (index < GameState.field_col * 2 + GameState.field_row){
            wall = GLOBALS.WALL.TYPE.EAST;
            loc = index - GameState.field_col * 2;
        } else if (index < GameState.field_col * 2 + GameState.field_row * 2){
            wall = GLOBALS.WALL.TYPE.WEST;
            loc = index - GameState.field_col * 2 - GameState.field_row;
        }
        this.init(wall, loc);
    }

    set_type(type){
        this.type = type;
        this.sprite.setFrame(type);
        // 必須アイテムはブリンク
        if (type === GLOBALS.ITEM.TYPE.KEY ||
            type === GLOBALS.ITEM.TYPE.BOX_OPEN){
                this.set_blink();
        }
    }

    set_blink_out(){
        this.type = GLOBALS.ITEM.TYPE.NONE;
        this.isBlinking = false;
        this.sprite.clearTint();
        this.scene.tweens.add({targets: this.sprite,
            alpha: { from: 1, to: 0.4 },
            duration: 160,
            repeat: 6,
            onComplete: () => {
                // if (this.sprite){
                //    this.sprite.setFrame(GLOBALS.ITEM.TYPE.NONE).setAlpha(1);
                // }
                this.setAlive(false);
            }
        });
    }

    set_blink(){
        this.isBlinking = true;
        this.blink_index = 0;
        this.blink_count = BLINK_COUNTS[this.blink_index];
    }

    set_visible(visible){
        this.sprite.setVisible(visible);
    }

    get_visible(){
        return this.sprite.visible;
    }

    update(){
        // ブリンク表示
        if (this.isBlinking){
            this.blink_count -= 1;
            if (this.blink_count <= 0){
                this.blink_index += 1;
                if (this.blink_index >= BLINK_COUNTS.length){
                    this.blink_index = 0;
                }
                this.blink_count = BLINK_COUNTS[this.blink_index];
                if ((this.blink_index & 1) === 0){
                    this.sprite.clearTint();
                } else {
                    this.sprite.setTintFill(0xffffff);
                }
            }
        }
    }
}