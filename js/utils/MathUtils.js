// MathUtils.js
import { GLOBALS } from "../GameConst.js";
import { GameState } from '../GameState.js';

export class MyMath {

    // 変換：角度からラジアン
    static radians(degrees){
        return degrees * (Math.PI / 180);
    }

    // 変換：ラジアンから角度
    static degrees(radians){
        return radians * (180 / Math.PI);
    }

    // 変換：座標からパネル位置とパネル内相対座標
    static get_loc_from_pos(pos_x, pos_y){
        const fx = pos_x - GameState.field_origin_x - GLOBALS.WALL.SIZE.THICK;
        const fy = pos_y - GameState.field_origin_y - GLOBALS.WALL.SIZE.THICK;
        const loc_x = Math.floor(fx / GLOBALS.PANEL.WIDTH);
        const rel_pos_x = fx % GLOBALS.PANEL.WIDTH;
        const loc_y = Math.floor(fy / GLOBALS.PANEL.HEIGHT);
        const rel_pos_y = fy % GLOBALS.PANEL.HEIGHT;
        return {loc_x, loc_y, rel_pos_x, rel_pos_y};
    }

    // 変換：パネル位置から中心座標
    static get_pos_from_loc(loc_x, loc_y){
        const pos_x = GameState.field_origin_x + GLOBALS.WALL.SIZE.THICK
             + loc_x * GLOBALS.PANEL.WIDTH + GLOBALS.PANEL.WIDTH / 2;
        const pos_y = GameState.field_origin_y + GLOBALS.WALL.SIZE.THICK
             + loc_y * GLOBALS.PANEL.HEIGHT + GLOBALS.PANEL.HEIGHT / 2;
        return {pos_x, pos_y};
    }

    // 変換：パネル位置から左上座標
    static get_top_left_from_loc(loc_x, loc_y){
        const top = GameState.field_origin_x + GLOBALS.WALL.SIZE.THICK
             + loc_x * GLOBALS.PANEL.WIDTH;
        const left = GameState.field_origin_y + GLOBALS.WALL.SIZE.THICK
             + loc_y * GLOBALS.PANEL.HEIGHT;
        return {top, left};
    }

    // 変換：パネル内相対座標からキャラクタの各辺の相対座標
    static get_movable_side(rel_pos_x, rel_pos_y, size){
        const m_top = rel_pos_y - size / 2;
        const m_bottom = rel_pos_y + size / 2;
        const m_right = rel_pos_x + size / 2;
        const m_left = rel_pos_x - size / 2;
        return {m_top, m_bottom, m_left, m_right}
    }

    // 変換：方向を反転
    static invert_direction(from_dir){
        let to_dir = null;
        if (from_dir === GLOBALS.DIR.UP){
            to_dir = GLOBALS.DIR.DOWN;
        } else if (from_dir === GLOBALS.DIR.DOWN){
            to_dir = GLOBALS.DIR.UP;
        } else if (from_dir === GLOBALS.DIR.LEFT){
            to_dir = GLOBALS.DIR.RIGHT;
        } else if (from_dir === GLOBALS.DIR.RIGHT){
            to_dir = GLOBALS.DIR.LEFT;
        }
        return to_dir;
    }

    // 判定：パネルの中央にいるか
    static isCenter(pos_x,pos_y){
        const { rel_pos_x, rel_pos_y} = MyMath.get_loc_from_pos(pos_x, pos_y);
        return ( rel_pos_x === GLOBALS.PANEL.WIDTH / 2 &&
                 rel_pos_y === GLOBALS.PANEL.HEIGHT / 2 );
    }

    // 判定：経路上にいるか
    static isOnPath(pos_x,pos_y){
        const { loc_x, loc_y, rel_pos_x, rel_pos_y} = MyMath.get_loc_from_pos(pos_x, pos_y);
        if (loc_x < 0 || loc_x >= GLOBALS.FIELD.COL || 
            loc_y < 0 || loc_y >= GLOBALS.FIELD.ROW ){
            return false;
        }

        const p = GameState.panels[loc_x][loc_y];
        // console.log("p.fence(top,bottom,left,right):(",p.fence.top, p.fence.bottom, p.fence.left, p.fence.right, ") rel_pos_x:",rel_pos_x, " rel_pos_y:", rel_pos_y);
        if (!p.fence.top){
            if ( rel_pos_x == GLOBALS.PANEL.WIDTH / 2 &&
                 rel_pos_y <= GLOBALS.PANEL.HEIGHT / 2 &&
                 rel_pos_y >= 0 ){
                return true;
            }
        } 
        if (!p.fence.bottom){
            if ( rel_pos_x == GLOBALS.PANEL.WIDTH / 2 &&
                 rel_pos_y >= GLOBALS.PANEL.HEIGHT / 2 &&
                 rel_pos_y <= GLOBALS.PANEL.HEIGHT){
                return true;
            }
        } 
        if (!p.fence.left){
            if ( rel_pos_y == GLOBALS.PANEL.HEIGHT / 2 &&
                 rel_pos_x >= 0 &&
                 rel_pos_x <= GLOBALS.PANEL.WIDTH / 2){
                return true;
            }
        }
        if (!p.fence.right){
            if ( rel_pos_y == GLOBALS.PANEL.HEIGHT / 2 &&
                 rel_pos_x >= GLOBALS.PANEL.WIDTH / 2 &&
                 rel_pos_x <= GLOBALS.PANEL.WIDTH){
                return true;
            }
        }
        return false;
    }

    // 判定：外壁に当たっているか
    static isOnWall(pos_x, pos_y, size){
        const { loc_x, loc_y, rel_pos_x, rel_pos_y} = MyMath.get_loc_from_pos(pos_x, pos_y);
        const { m_top, m_bottom, m_left, m_right} = MyMath.get_movable_side(rel_pos_x, rel_pos_y, size);
        // 外壁に当たっているか
        if ( loc_x < 0 || (loc_x == 0 && m_left < 0 ) ||
            loc_x >= GLOBALS.FIELD.COL || (loc_x == GLOBALS.FIELD.COL - 1 && m_right > GLOBALS.PANEL.WIDTH) ||
            loc_y < 0 || (loc_y == 0 && m_top < 0 ) ||
            loc_y >= GLOBALS.FIELD.ROW || (loc_y == GLOBALS.FIELD.ROW - 1 && m_bottom > GLOBALS.PANEL.HEIGHT)){
            return true;
        }
        return false;
    }

    // 判定：外側のパネル内壁や外壁に当たっているか
    static isOnOuterFence(pos_x, pos_y, size){
        const { loc_x, loc_y, rel_pos_x, rel_pos_y} = MyMath.get_loc_from_pos(pos_x, pos_y);
        const { m_top, m_bottom, m_left, m_right} = MyMath.get_movable_side(rel_pos_x, rel_pos_y, size);
        // 外壁に当たっているか
        if ( loc_x < 0 || (loc_x == 0 && m_left < 0 ) ||
            loc_x >= GLOBALS.FIELD.COL || (loc_x == GLOBALS.FIELD.COL - 1 && m_right > GLOBALS.PANEL.WIDTH) ||
            loc_y < 0 || (loc_y == 0 && m_top < 0 ) ||
            loc_y >= GLOBALS.FIELD.ROW || (loc_y == GLOBALS.FIELD.ROW - 1 && m_bottom > GLOBALS.PANEL.HEIGHT)){
            return true;
        }
        // 隣接するパネルの内壁に当たっているか
        if ( (m_top < 0 && GameState.panels[loc_x][loc_y - 1].fence.bottom) ||
             (m_bottom > GLOBALS.PANEL.HEIGHT && GameState.panels[loc_x][loc_y + 1].fence.top) ||
             (m_left < 0 && GameState.panels[loc_x - 1][loc_y].fence.right) ||
             (m_right > GLOBALS.PANEL.WIDTH && GameState.panels[loc_x + 1][loc_y].fence.left)){
            return true;
        }
        // 隣接するパネルがフリップ中か
        if ( (m_top < 0 && this.isFlipping(loc_x, loc_y - 1)) ||
             (m_bottom > GLOBALS.PANEL.HEIGHT && this.isFlipping(loc_x, loc_y + 1)) ||
             (m_left < 0 && this.isFlipping(loc_x - 1, loc_y)) ||
             (m_right > GLOBALS.PANEL.WIDTH && this.isFlipping(loc_x + 1, loc_y)) ){
            return true;
        }
        return false;
    }

    // 判定：隣接するパネルに移行可能か（パネル単位）
    static isMovable(loc_x, loc_y, dir){
        // console.log("isMovable:",loc_x, loc_y, dir);
        if (dir === GLOBALS.DIR.UP){
            return (loc_y > 0 &&
                    !GameState.panels[loc_x][loc_y].fence.top &&
                    !GameState.panels[loc_x][loc_y - 1].fence.bottom &&
                    !this.isFlipping(loc_x, loc_y - 1)
            );
        } else if (dir === GLOBALS.DIR.DOWN){
             return (loc_y < GLOBALS.FIELD.ROW - 1 &&
                    !GameState.panels[loc_x][loc_y].fence.bottom &&
                    !GameState.panels[loc_x][loc_y + 1].fence.top &&
                    !this.isFlipping(loc_x, loc_y + 1)
            );
        } else if (dir === GLOBALS.DIR.LEFT){
             return (loc_x > 0 &&
                    !GameState.panels[loc_x][loc_y].fence.left &&
                    !GameState.panels[loc_x - 1][loc_y].fence.right &&
                    !this.isFlipping(loc_x - 1, loc_y)
            );           
        } else if (dir === GLOBALS.DIR.RIGHT){
             return (loc_x < GLOBALS.FIELD.COL - 1 &&
                    !GameState.panels[loc_x][loc_y].fence.right &&
                    !GameState.panels[loc_x + 1][loc_y].fence.left &&
                    !this.isFlipping(loc_x + 1, loc_y)
            );
        }
        return false;
    }

    // 判定：当該パネルがフリップ中か
    static isFlipping(loc_x, loc_y){
        const st = GameState.panels[loc_x][loc_y].state;
        return (st === GLOBALS.PANEL.STATE.FLIP_ABOVE || st === GLOBALS.PANEL.STATE.FLIP_BELOW);
    }

    // 判定：パネル内壁に当たっているか
    static isOnInnerFence(pos_x, pos_y, size){
        const { loc_x, loc_y, rel_pos_x, rel_pos_y} = MyMath.get_loc_from_pos(pos_x, pos_y);
        const { m_top, m_bottom, m_left, m_right} = MyMath.get_movable_side(rel_pos_x, rel_pos_y, size); 
        // そもそもフィールド内のパネル上か
        if (loc_x < 0 || loc_x >= GLOBALS.FIELD.COL ||
            loc_y < 0 || loc_y >= GLOBALS.FIELD.ROW ){
            return true;
        }
        // パネル内の内壁に当たっているか
        const p = GameState.panels[loc_x][loc_y];
        if ( (p.fence.top && m_top < GLOBALS.PANEL.FENCE.THICK) ||
             (p.fence.bottom && m_bottom > GLOBALS.PANEL.HEIGHT - GLOBALS.PANEL.FENCE.THICK) ||
             (p.fence.left && m_left < GLOBALS.PANEL.FENCE.THICK) ||
             (p.fence.right && m_right > GLOBALS.PANEL.WIDTH - GLOBALS.PANEL.FENCE.THICK) ){
            return true;
        }
        return false;
    }

    // 判定：どの外壁番号に接しているか
    static getWallNumber(pos_x, pos_y, size){
        const { loc_x, loc_y, rel_pos_x, rel_pos_y} = MyMath.get_loc_from_pos(pos_x, pos_y);
        const { m_top, m_bottom, m_left, m_right} = MyMath.get_movable_side(rel_pos_x, rel_pos_y, size);

        if ( loc_x < 0 || (loc_x == 0 && m_left < 0 )){
            // EAST
            return loc_y + GLOBALS.FIELD.COL * 2 + GLOBALS.FIELD.ROW;
        } else if ( loc_x >= GLOBALS.FIELD.COL || (loc_x == GLOBALS.FIELD.COL - 1 && m_right > GLOBALS.PANEL.WIDTH)){
            // WEST
            return loc_y + GLOBALS.FIELD.COL * 2;
        } else if ( loc_y < 0 || (loc_y == 0 && m_top < 0 )){
            // NORTH
            return loc_x;
        } else if ( loc_y >= GLOBALS.FIELD.ROW || (loc_y == GLOBALS.FIELD.ROW - 1 && m_bottom > GLOBALS.PANEL.HEIGHT)){
            // SOUTH
            return loc_x + GLOBALS.FIELD.COL;
        }
        return null;
    }

    // 判定：２つの矩形が重なっているか
    static isRectangleOverlap(xa1, ya1, xa2, ya2, xb1, yb1, xb2, yb2) {

        if (xa2 < xb1 || xa1 > xb2) {
        // x軸が完全に外れている
            return false;
        }
        if (ya2 < yb1 || ya1 > yb2) {
        // y軸が完全に外れている
            return false;
        }
        // 上記のどちらにも当てはまらない場合、重なっている
        return true;
    }

    // 判定：フリップ中の上パネルの内壁に当たっているか
    static isHittingAboveFence(pos_x, pos_y, size, p){
        if (p.fence.top){
            if (this.isRectangleOverlap(pos_x-size/2, pos_y-size/2, pos_x+size/2, pos_y+size/2,
                p.pos.x, p.pos.y, p.pos.x + GLOBALS.PANEL.WIDTH, p.pos.y + GLOBALS.PANEL.FENCE.THICK)){
                return true;
            }
        }
        if (p.fence.bottom){
            if (this.isRectangleOverlap(pos_x-size/2, pos_y-size/2, pos_x+size/2, pos_y+size/2,
                p.pos.x, p.pos.y + GLOBALS.PANEL.HEIGHT - GLOBALS.PANEL.FENCE.THICK,
                p.pos.x + GLOBALS.PANEL.WIDTH, p.pos.y + GLOBALS.PANEL.HEIGHT)){
                return true;
            }
        }
        if (p.fence.left){
            if (this.isRectangleOverlap(pos_x-size/2, pos_y-size/2, pos_x+size/2, pos_y+size/2,
                p.pos.x, p.pos.y, p.pos.x + GLOBALS.PANEL.FENCE.THICK, p.pos.y + GLOBALS.PANEL.HEIGHT)){
                return true;
            }
        }
        if (p.fence.right){
            if (this.isRectangleOverlap(pos_x-size/2, pos_y-size/2, pos_x+size/2, pos_y+size/2,
                p.pos.x + GLOBALS.PANEL.WIDTH - GLOBALS.PANEL.FENCE.THICK, p.pos.y,
                p.pos.x + GLOBALS.PANEL.WIDTH, p.pos.y + GLOBALS.PANEL.HEIGHT)){
                return true;
            }
        }
        return false;
    }

    // 判定：自機と、敵や弾が当たっているか
    static isHittingCharacter(c_pos, c_size, p_pos, p_size){
        return this.isRectangleOverlap(c_pos.x - c_size / 2, c_pos.y - c_size /2, c_pos.x + c_size / 2, c_pos.y + c_size /2,
                p_pos.x - p_size / 2, p_pos.y - p_size / 2, p_pos.x + p_size / 2, p_pos.y + p_size / 2);
    }
}