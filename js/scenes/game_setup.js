// game_setup.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyMath } from '../utils/MathUtils.js';
import { Panel } from '../objects/panel.js';
import { Wall } from '../objects/wall.js'; 
import { Item } from '../objects/item.js';
import { E1 } from '../objects/e1.js'; 
import { E2 } from '../objects/e2.js'; 
import { E3 } from '../objects/e3.js'; 
import { E4 } from '../objects/e4.js'; 
import { E5 } from '../objects/e5.js'; 
import { Player } from '../objects/player.js'; 
import { Cursor } from '../objects/cursor.js';

const enemyClassMap = {
    1: E1,
    2: E2,
    3: E3,
    4: E4,
    5: E5
};

export class Setup {
    constructor(scene) {
        this.scene = scene;
        this.floorData = this.scene.cache.json.get('floor_data');
        this.bg = null;
    }

    make_field(){
        // フロアデータの読み込み
        const floorInfo = this.floorData.floors.find(s => s.floor === GameState.floor);
        GameState.field_col = floorInfo.col;
        GameState.field_row = floorInfo.row;
        GameState.field_width = GLOBALS.PANEL.WIDTH * GameState.field_col + GLOBALS.WALL.SIZE.THICK * 2;
        GameState.field_height = GLOBALS.PANEL.HEIGHT * GameState.field_row + GLOBALS.WALL.SIZE.THICK * 2;
        GameState.field_offset_x = (GLOBALS.FIELD.WIDTH - GameState.field_width) / 2;
        GameState.field_offset_y = (GLOBALS.FIELD.HEIGHT - GameState.field_height) / 2;

        // 背景の作成
        this.bg = this.scene.add.tileSprite(GameState.field_origin_x + GameState.field_offset_x,
                                      GameState.field_origin_y + GameState.field_offset_y,
                                      GameState.field_width,
                                      GameState.field_height,
                                      'bg').setOrigin(0).setDepth(-1);
        this.bg.setTint(0x808080);

        // パネルの作成
        GameState.panels = [];
        for (let j = 0; j < GameState.field_row; j++) {
            for (let i = 0; i < GameState.field_col; i++) {
                const panelType = floorInfo.field[j][i];
                const p = new Panel(this.scene);
                p.init(panelType, new Phaser.Math.Vector2(i, j));
                if (!GameState.panels[i]) GameState.panels[i] = [];
                GameState.panels[i][j] = p;
            }
        }

        // 外壁とアイテム枠の作成
        for (let i=0; i<GameState.field_col; i++){
            const wn = new Wall(this.scene);
            wn.init(GLOBALS.WALL.TYPE.NORTH,new Phaser.Math.Vector2(i, 0));
            GameState.walls[i] = wn;

            const itn = new Item(this.scene);
            itn.init(GLOBALS.WALL.TYPE.NORTH,new Phaser.Math.Vector2(i, 0));
            GameState.items[i] = itn;

            const ws = new Wall(this.scene);
            ws.init(GLOBALS.WALL.TYPE.SOUTH,new Phaser.Math.Vector2(i, 1));
            GameState.walls[i + GameState.field_col] = ws;

            const its = new Item(this.scene);
            its.init(GLOBALS.WALL.TYPE.SOUTH,new Phaser.Math.Vector2(i, 1));
            GameState.items[i + GameState.field_col] = its;
        }
        for (let i=0; i<GameState.field_row; i++){
            const we = new Wall(this.scene);
            we.init(GLOBALS.WALL.TYPE.EAST,new Phaser.Math.Vector2(1, i));
            GameState.walls[i + GameState.field_col * 2] = we;

            const ite = new Item(this.scene);
            ite.init(GLOBALS.WALL.TYPE.EAST,new Phaser.Math.Vector2(1, i));
            GameState.items[i + GameState.field_col * 2] = ite;

            const ww = new Wall(this.scene);
            ww.init(GLOBALS.WALL.TYPE.WEST,new Phaser.Math.Vector2(0, i));
            GameState.walls[i + GameState.field_col * 2 + GameState.field_row] = ww;

            const itw = new Item(this.scene);
            itw.init(GLOBALS.WALL.TYPE.WEST,new Phaser.Math.Vector2(0, i));
            GameState.items[i + GameState.field_col * 2 + GameState.field_row] = itw;            
        }
        GameState.walls_corner = [];
        const wc0 = new Wall(this.scene);
        wc0.init(GLOBALS.WALL.TYPE.CORNER,new Phaser.Math.Vector2(0, 0));
        GameState.walls[0 + GameState.field_col * 2 + GameState.field_row * 2] = wc0;
        const wc1 = new Wall(this.scene);
        wc1.init(GLOBALS.WALL.TYPE.CORNER,new Phaser.Math.Vector2(1, 0));
        GameState.walls[1 + GameState.field_col * 2 + GameState.field_row * 2] = wc1;
        const wc2 = new Wall(this.scene);
        wc2.init(GLOBALS.WALL.TYPE.CORNER,new Phaser.Math.Vector2(0, 1));
        GameState.walls[2 + GameState.field_col * 2 + GameState.field_row * 2] = wc2;
        const wc3 = new Wall(this.scene);
        wc3.init(GLOBALS.WALL.TYPE.CORNER,new Phaser.Math.Vector2(1, 1));
        GameState.walls[3 + GameState.field_col * 2 + GameState.field_row * 2] = wc3;    

        // 必須アイテムをランダムな位置に配置
        this.place_item(GLOBALS.ITEM.TYPE.KEY);
        this.place_item(GLOBALS.ITEM.TYPE.EXIT);
        if (GameState.item_boxes[GameState.floor] ===false){
            this.place_item(GLOBALS.ITEM.TYPE.BOX);
        }

        // 追加アイテムがあれば、ランダムな位置に配置
        if (floorInfo.items){
            for (const itemData of floorInfo.items) {
                const { type } = itemData;
                this.place_item(type);
            }
        }

        // タイマーのリセット
        if (floorInfo.time){
                GameState.time = floorInfo.time;
        } else {
                GameState.time = GLOBALS.TIME_MAX;
        }

        // 自機の配置
        GameState.player = new Player(this.scene);
        const { x, y } = floorInfo.player;
        const {pos_x : xp, pos_y : yp } = MyMath.get_pos_from_loc( x, y );
        GameState.player.init(0,new Phaser.Math.Vector2(xp, yp));

        // カーソルの配置
        GameState.cursor = new Cursor(this.scene);
        const {pos_x : xc, pos_y : yc } = MyMath.get_pos_from_loc(3, 2);
        GameState.cursor.init(0,new Phaser.Math.Vector2(xc, yc));

        // 敵の配置
        for (const enemyData of floorInfo.enemies) {
            const { x, y, tribe,  type, dir } = enemyData;
            // console.log("setup enemy:",x,y,tribe,type,dir);
            const EnemyClass = enemyClassMap[tribe];
            const e = new EnemyClass(this.scene);
            const pos = MyMath.get_pos_from_loc(x, y);
            e.init(type, new Phaser.Math.Vector2(pos.pos_x, pos.pos_y));
            if (dir != null) e.set_dir(dir);
            GameState.enemies.push(e);
        }
    }

    place_item(type){
        const empty_list = GameState.items
            .map((item, i) => ({ item, i }))
            .filter(({ item }) => item.type === GLOBALS.ITEM.TYPE.NONE)
            .map(({ i }) => i);
        if (empty_list.length === 0){
            return false;
        } else {
            const i = empty_list[Phaser.Math.Between(0, empty_list.length - 1)];
            GameState.items[i].set_type(type);
            return true;
        }
    }

    clean_up(){
        // 自機
        if (GameState.player){
            GameState.player.destroy();
        }

        // カーソル
        if (GameState.cursor){
            GameState.cursor.destroy();
        }

        // 敵機
        for (let i = GameState.enemies.length - 1; i >= 0; i--) {
            GameState.enemies[i].destroy();
            GameState.enemies.splice(i, 1);
        }
        GameState.enemies = [];

        // 弾
        for (let i = GameState.bullets.length - 1; i >= 0; i--) {
            GameState.bullets[i].destroy();
            GameState.bullets.splice(i, 1);
        }
        GameState.bullets = [];

        // 壁
        for (let i = GameState.walls.length - 1; i >= 0; i--){            
            GameState.walls[i].destroy();
            GameState.walls.splice(i,1);
        }
        GameState.walls = [];

        // アイテム
        for (let i = GameState.items.length - 1; i >= 0; i--){
            GameState.items[i].destroy();
            GameState.items.splice(i,1);
        }
        GameState.items = [];

        // パネル
        for (let i=GameState.panels.length - 1; i>=0; i--){
            for (let j=GameState.panels[i].length - 1; j>=0; j--){
                GameState.panels[i][j].destroy();
            }
            GameState.panels[i] = null;
        }
        GameState.panels = [];

        // 画面効果
        for (let i = GameState.effects.length - 1; i >= 0; i--){
            GameState.effects[i].destroy();
            GameState.effects.splice(i,1);
        }
        GameState.effects = [];

        // 背景
        if (this.bg){
            this.bg.destroy();
        }
    }
}