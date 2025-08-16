// game_item_box_checkers.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';

// ◆宝箱チェッカー
const itemBoxCheckers = {
  // FLOOR 1 : 敵を残り１以下にする　→ スピードUP
  1: { check: () => { if (GameState.enemies.length <= 1) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);}},
       hint: "ENEMIES TO 1",
       item: "SPEED UP"
  },
  // FLOOR 2 : 敵を残り１以下にする → バリア
  2: { check: () => { if (GameState.enemies.length <= 1) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 1",
        item: "BARRIER"
  },
  // FLOOR 3 : 敵を残り１以下にする→ フリップUP
  3: { check: () => { if (GameState.enemies.length <= 1) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 1",
        item: "QUICK FLIP"
  },
  // FLOOR 4 : 敵を残り１以下にする →　スコープ
  4: { check: () => { if (GameState.enemies.length <= 1) {
          open_item_box(GLOBALS.ITEM.TYPE.SCOPE);} },
        hint: "ENEMIES TO 1",
        item: "SCOPE"
  },
  // FLOOR 5 : 敵を残り１以下にする → スピードUP
  5: { check: () => { if (GameState.enemies.length <= 1) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 1",
        item: "SPEED UP"
  },
  // FLOOR 6 : 敵を残り１以下にする  → フリップUP
  6: { check: () => { if (GameState.enemies.length <= 1) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 1",
        item: "QUICK FLIP"
  },
  // FLOOR 7 : 敵を全滅させる  → スコープ
  7: { check: () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SCOPE);} },
        hint: "ENEMIES TO 0",
        item: "SCOPE"
  },
  // FLOOR 8 : 敵を全滅させる → スピードUP
  8: { check: () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
  },
  // FLOOR 9 : 敵を全滅させる → フリップUP
  9: { check: () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
  },
  // FLOOR 10 : 敵を全滅させる → リング
  10: { check: () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.RING);} },
        hint: "ENEMIES TO 0",
        item: "RING"
  },
  // FLOOR 11 : 敵を残り１以下にする　→ スピードUP
  11: { check : () => { if (GameState.enemies.length <= 1) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 1",
        item: "SPEED UP"
      },
  // FLOOW 12 : 敵を全滅させる → フリップUP
  12: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 13 : 上辺のパネルに移動する → USB
  13: { check : () => { const { loc_x, loc_y, rel_pos_x, rel_pos_y} = MyMath.get_loc_from_pos(GameState.player.pos.x, GameState.player.pos.y);
             if (loc_y === 0){
                open_item_box(GLOBALS.ITEM.TYPE.USB); }},
        hint: "MOVE TO THE TOP PANEL",
        item: "USB"
      },
  // FLOOR 14 : 下辺の壁に接触する → スコープ
  14: { check : () => { const { loc_x, loc_y, rel_pos_x, rel_pos_y} = MyMath.get_loc_from_pos(GameState.player.pos.x, GameState.player.pos.y);
             const { m_top, m_bottom, m_left, m_right} = MyMath.get_movable_side(rel_pos_x, rel_pos_y, GameState.player.size);
             if (loc_y === GameState.field_row - 1 && m_bottom === GLOBALS.PANEL.HEIGHT){
              open_item_box(GLOBALS.ITEM.TYPE.SCOPE); }},
        hint: "TOUCH THE BOTTOM WALL",
        item: "SCOPE"
      },
  // FLOOR 15 : 敵を全滅させる → フリップUP
  15: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 16 : 敵を全滅させる → リングUP
  16: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.RING);} },
        hint: "ENEMIES TO 0",
        item: "RING"
      },
  // FLOOR 17 : 敵を全滅させる → バリア
  17: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 18 : 敵を全滅させる → USB
  18: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.USB);} },
        hint: "ENEMIES TO 0",
        item: "USB"
      },
  // FLOOR 19 : 敵を全滅させる → フリップUP
  19: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 20 : 敵を全滅させる → スコープ
  20: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SCOPE);} },
        hint: "ENEMIES TO 0",
        item: "SCOPE"
      },
  // FLOOR 21 : 敵を全滅させる → スピードUP
  21: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
      },
  // FLOOR 22 : 敵を全滅させる → フリップUP
  22: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 23 : 敵を全滅させる → バリア
  23: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 24 : 敵を全滅させる → スピードUP
  24: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
      },
  // FLOOR 25 : 敵を全滅させる → フリップUP
  25: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 26 : 敵を全滅させる → バリア
  26: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 27 : 敵を全滅させる → スピードUP
  27: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
      },
  // FLOOR 28 : 敵を全滅させる → フリップUP
  28: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 29 : 敵を全滅させる → バリア
  29: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 30 : 敵を全滅させる → スピードUP
  30: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
      },
  // FLOOR 31 : 敵を全滅させる → フリップUP
  31: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 32 : 敵を全滅させる → バリア
  32: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 33 : 敵を全滅させる → スピードUP
  33: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
      },
  // FLOOR 34 : 敵を全滅させる → フリップUP
  34: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 35 : 敵を全滅させる → バリア
  35: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 36 : 敵を全滅させる → スピードUP
  36: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
      },
  // FLOOR 37 : 敵を全滅させる → フリップUP
  37: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 38 : 敵を全滅させる → バリア
  38: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 39 : 敵を全滅させる → スピードUP
  39: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
      },
  // FLOOR 40 : 敵を全滅させる → フリップUP
  40: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 41 : 敵を全滅させる → バリア
  41: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 42 : 敵を全滅させる → スピードUP
  42: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
      },
  // FLOOR 43 : 敵を全滅させる → フリップUP
  43: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 44 : 敵を全滅させる → バリア
  44: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 45 : 敵を全滅させる → スピードUP
  45: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
      },
  // FLOOR 46 : 敵を全滅させる → フリップUP
  46: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 47 : 敵を全滅させる → バリア
  47: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 48 : 敵を全滅させる → スピードUP
  48: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
      },
  // FLOOR 49 : 敵を全滅させる → フリップUP
  49: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 50 : 敵を全滅させる → バリア
  50: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 51 : 敵を全滅させる → スピードUP
  51: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
      },
  // FLOOR 52 : 敵を全滅させる → フリップUP
  52: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 53 : 敵を全滅させる → バリア
  53: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 54 : 敵を全滅させる → スピードUP
  54: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
      },
  // FLOOR 55 : 敵を全滅させる → フリップUP
  55: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 56 : 敵を全滅させる → バリア
  56: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 57 : 敵を全滅させる → スピードUP
  57: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.SPEED);} },
        hint: "ENEMIES TO 0",
        item: "SPEED UP"
      },
  // FLOOR 58 : 敵を全滅させる → フリップUP
  58: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.FLIP);} },
        hint: "ENEMIES TO 0",
        item: "QUICK FLIP"
      },
  // FLOOR 59 : 敵を全滅させる → バリア
  59: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
  // FLOOR 60 : 敵を全滅させる → バリア
  60: { check : () => { if (GameState.enemies.length === 0) {
          open_item_box(GLOBALS.ITEM.TYPE.BARRIER);} },
        hint: "ENEMIES TO 0",
        item: "BARRIER"
      },
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
      if (checker_item_box && checker_item_box.check) checker_item_box.check();
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

export function get_box_hint(){
  const checker = itemBoxCheckers[GameState.floor];
  if (checker && checker.hint) {
    return checker.hint;
  }
}

export function get_box_item(){
  const checker = itemBoxCheckers[GameState.floor];
  if (checker && checker.item) {
    return checker.item;
  }
}