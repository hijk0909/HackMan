// game_item_box_checkers.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';

const itemBoxCheckers = {
  // FLOOR 1 : 敵を残り１以下にする　→ スピードUP
  1: () => { if (GameState.enemies.length <= 1) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOW 2 : 敵を全滅させる → フリップUP
  2: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 3 : 上辺のパネルに移動する → スピードUP
  3: () => { const { loc_x, loc_y, rel_pos_x, rel_pos_y} = MyMath.get_loc_from_pos(GameState.player.pos.x, GameState.player.pos.y);
             if (loc_y === 0){ open_item_box(GLOBALS.ITEM.TYPE.SPEED); }},
  // FLOOR 4 : 下辺の壁に接触する → フリップUP
  4: () => { const { loc_x, loc_y, rel_pos_x, rel_pos_y} = MyMath.get_loc_from_pos(GameState.player.pos.x, GameState.player.pos.y);
             const { m_top, m_bottom, m_left, m_right} = MyMath.get_movable_side(rel_pos_x, rel_pos_y, GameState.player.size);
             if (loc_y === GLOBALS.FIELD.ROW - 1 && m_bottom === GLOBALS.PANEL.HEIGHT){ open_item_box(GLOBALS.ITEM.TYPE.FLIP); }},
  // FLOOR 5 : 敵を全滅させる → スピードUP
  5: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOR 6 : 敵を全滅させる → フリップUP
  6: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 7 : 敵を全滅させる → スピードUP
  7: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOR 8 : 敵を全滅させる → フリップUP
  8: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 9 : 敵を全滅させる → スピードUP
  9: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOR 10 : 敵を全滅させる → フリップUP
  10: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 11 : 敵を全滅させる → フリップUP
  11: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 12 : 敵を全滅させる → フリップUP
  12: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 13 : 敵を全滅させる → フリップUP
  13: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 14 : 敵を全滅させる → フリップUP
  14: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 15 : 敵を全滅させる → フリップUP
  15: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 16 : 敵を全滅させる → フリップUP
  16: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 17 : 敵を全滅させる → フリップUP
  17: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 18 : 敵を全滅させる → フリップUP
  18: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 19 : 敵を全滅させる → フリップUP
  19: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 20 : 敵を全滅させる → フリップUP
  20: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 21 : 敵を全滅させる → フリップUP
  21: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
};

export function unlock_item_box(){
    if (GameState.item_boxes[GameState.floor] === false){
        const checker = itemBoxCheckers[GameState.floor];
        if (checker) checker();
    }
}

function open_item_box(type){
  for (let j = 0 ; j < GameState.items.length; j++){
      if (GameState.items[j].type === GLOBALS.ITEM.TYPE.BOX ){
          GameState.items[j].set_type(GLOBALS.ITEM.TYPE.BOX_OPEN);
          GameState.items[j].set_inner_type(type);
          GameState.items[j].set_visible(true);
      }
  }  
}