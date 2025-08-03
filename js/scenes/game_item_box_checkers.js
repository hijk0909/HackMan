// game_item_box_checkers.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';

// ◆宝箱チェッカー
const itemBoxCheckers = {
  // FLOOR 1 : 敵を残り１以下にする　→ スピードUP
  1: () => { if (GameState.enemies.length <= 1) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOR 2 : 敵を残り１以下にする → フリップUP
  2: () => { if (GameState.enemies.length <= 1) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 3 : 敵を残り１以下にする→ スピードUP
  3: () => { if (GameState.enemies.length <= 1) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOR 4 : 敵を残り１以下にする → フリップUP
  4: () => { if (GameState.enemies.length <= 1) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 5 : 敵を残り１以下にする → スピードUP
  5: () => { if (GameState.enemies.length <= 1) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOR 6 : 敵を残り１以下にする  → フリップUP
  6: () => { if (GameState.enemies.length <= 1) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 7 : 敵を残り１以下にする  → スピードUP
  7: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOR 8 : 敵を全滅させる → フリップUP
  8: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 9 : 敵を全滅させる → スピードUP
  9: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOR 10 : 敵を全滅させる → フリップUP
  10: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 11 : 敵を残り１以下にする　→ スピードUP
  11: () => { if (GameState.enemies.length <= 1) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOW 12 : 敵を全滅させる → フリップUP
  12: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 13 : 上辺のパネルに移動する → スピードUP
  13: () => { const { loc_x, loc_y, rel_pos_x, rel_pos_y} = MyMath.get_loc_from_pos(GameState.player.pos.x, GameState.player.pos.y);
             if (loc_y === 0){ open_item_box(GLOBALS.ITEM.TYPE.SPEED); }},
  // FLOOR 14 : 下辺の壁に接触する → フリップUP
  14: () => { const { loc_x, loc_y, rel_pos_x, rel_pos_y} = MyMath.get_loc_from_pos(GameState.player.pos.x, GameState.player.pos.y);
             const { m_top, m_bottom, m_left, m_right} = MyMath.get_movable_side(rel_pos_x, rel_pos_y, GameState.player.size);
             if (loc_y === GameState.field_row - 1 && m_bottom === GLOBALS.PANEL.HEIGHT){ open_item_box(GLOBALS.ITEM.TYPE.FLIP); }},
  // FLOOR 15 : 敵を全滅させる → スピードUP
  15: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOR 16 : 敵を全滅させる → フリップUP
  16: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 17 : 敵を全滅させる → スピードUP
  17: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOR 18 : 敵を全滅させる → フリップUP
  18: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 19 : 敵を全滅させる → スピードUP
  19: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOR 20 : 敵を全滅させる → フリップUP
  20: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 21 : 敵を全滅させる → フリップUP
  21: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 22 : 敵を全滅させる → フリップUP
  22: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 23 : 敵を全滅させる → フリップUP
  23: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 24 : 敵を全滅させる → フリップUP
  24: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 25 : 敵を全滅させる → フリップUP
  25: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 26 : 敵を全滅させる → フリップUP
  26: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 27 : 敵を全滅させる → フリップUP
  27: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 28 : 敵を全滅させる → フリップUP
  28: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 29 : 敵を全滅させる → フリップUP
  29: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 30 : 敵を全滅させる → フリップUP
  30: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 31 : 敵を全滅させる → フリップUP
  31: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 32 : 敵を残り１以下にする　→ スピードUP
  32: () => { if (GameState.enemies.length <= 1) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOR 33 : 敵を全滅させる → フリップUP
  33: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 34 : 敵を残り１以下にする　→ スピードUP
  34: () => { if (GameState.enemies.length <= 1) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
  // FLOOR 35 : 敵を全滅させる → フリップUP
  35: () => { if (GameState.enemies.length === 0) { open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
  // FLOOR 36 : 敵を残り１以下にする　→ スピードUP
  36: () => { if (GameState.enemies.length <= 1) { open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
};

// ◆常時チェッカー
const alwaysCheckers = {
// FLOOR 6 : ピクトを ALEFに 揃えると、全アイテムが可視化され、ピクトは消える
  6: () => {
      if (count_item(GLOBALS.ITEM.TYPE.PICT_ALEF) === 1){
          item_all_visible();
          item_all_blink_out(GLOBALS.ITEM.TYPE.PICT_ALEF);
      }
    },
// FLOOR 7 : ピクトを ALEFに 揃えると、全アイテムが可視化され、ピクトは消える
  7: () => {
      if (count_item(GLOBALS.ITEM.TYPE.PICT_ALEF) === 2){
          item_all_visible();
          item_all_blink_out(GLOBALS.ITEM.TYPE.PICT_ALEF);
      }
    }
}

// 毎フレーム呼ばれるチェック処理
export function unlock_item_box(){
  // 宝箱を取得済で無いときに呼ばれるチェック処理
  if (GameState.item_boxes[GameState.floor] === false){
      const checker_item_box = itemBoxCheckers[GameState.floor];
      if (checker_item_box) checker_item_box();
  }
  // フロア中ずっと呼ばれるチェック処理
  const checker_always = alwaysCheckers[GameState.floor];
  if (checker_always) checker_always();
}

function open_item_box(type){
  // 宝箱を解錠し、宝箱の中身を確定する
  for (let j = 0 ; j < GameState.items.length; j++){
      if (GameState.items[j].type === GLOBALS.ITEM.TYPE.BOX ){
          GameState.items[j].set_type(GLOBALS.ITEM.TYPE.BOX_OPEN);
          GameState.items[j].set_inner_type(type);
          GameState.items[j].set_visible(true);
      }
  }
}

function count_item(type){
  let count = 0;
  for (let j = 0 ; j < GameState.items.length; j++){
      if (GameState.items[j].type === type ) count++;
  }
  return count;
}

function item_all_visible(){
  for (let j = 0 ; j < GameState.items.length; j++){
      GameState.items[j].set_visible(true);
  }
}

function item_all_blink_out(type){
  for (let j = 0 ; j < GameState.items.length; j++){
      if (GameState.items[j].type === type ) {
        GameState.items[j].set_blink_out();
      }
  } 
}