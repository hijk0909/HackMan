// game_setup.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyMath } from '../utils/MathUtils.js';
import { Panel } from '../objects/panel.js';
import { Wall } from '../objects/wall.js'; 
import { I1 } from '../objects/i1.js'; 
import { I2 } from '../objects/i2.js'; 
import { I3 } from '../objects/i3.js'; 
import { I4 } from '../objects/i4.js'; 
import { E1 } from '../objects/e1.js'; 
import { E2 } from '../objects/e2.js'; 
import { E3 } from '../objects/e3.js'; 
import { E4 } from '../objects/e4.js'; 
import { E5 } from '../objects/e5.js'; 
import { Player } from '../objects/player.js'; 
import { Cursor } from '../objects/cursor.js';

const NUM_BG_FRAMES = 5;
const bgFramePeriods = [200,6,5,4,6];
const enemyClassMap = {
    1: E1,
    2: E2,
    3: E3,
    4: E4,
    5: E5
};

const font_family = '"Source Han Code JP", monospace';
const style = { fontSize: '24px', fontFamily: font_family, fill: '#ffffff',
                stroke: '#000000', strokeThickness: 2};

export class Setup {
    constructor(scene) {
        this.scene = scene;
        this.floorData = this.scene.cache.json.get('floor_data');
        this.bg = null;
        this.bgs = [];
        this.bgFrame = 0;
        this.bgFrameTimer = 0;
        this.ui_floor = null;
        this.ui_floor_pos = new Phaser.Math.Vector2(0, 0);
        this.set_box = false;
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
        for (let i = 0; i < NUM_BG_FRAMES; i++) {
            this.bgs[i] = this.scene.add.tileSprite(GameState.field_origin_x + GameState.field_offset_x,
                                      GameState.field_origin_y + GameState.field_offset_y,
                                      GameState.field_width,
                                      GameState.field_height,
                                      'ss_bg', i).setOrigin(0).setDepth(-2).setTint(0xffffff);
        }
        this.bgFrame = 0;
        this.bgFrameTimer = bgFramePeriods[this.bgFrame];

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

            const itn = new I1(this.scene);
            itn.init(GLOBALS.WALL.TYPE.NORTH,i);
            GameState.items[i] = itn;

            const ws = new Wall(this.scene);
            ws.init(GLOBALS.WALL.TYPE.SOUTH,new Phaser.Math.Vector2(i, 1));
            GameState.walls[i + GameState.field_col] = ws;

            const its = new I1(this.scene);
            its.init(GLOBALS.WALL.TYPE.SOUTH,i);
            GameState.items[i + GameState.field_col] = its;
        }
        for (let i=0; i<GameState.field_row; i++){
            const we = new Wall(this.scene);
            we.init(GLOBALS.WALL.TYPE.EAST,new Phaser.Math.Vector2(1, i));
            GameState.walls[i + GameState.field_col * 2] = we;

            const ite = new I1(this.scene);
            ite.init(GLOBALS.WALL.TYPE.EAST,i);
            GameState.items[i + GameState.field_col * 2] = ite;

            const ww = new Wall(this.scene);
            ww.init(GLOBALS.WALL.TYPE.WEST,new Phaser.Math.Vector2(0, i));
            GameState.walls[i + GameState.field_col * 2 + GameState.field_row] = ww;

            const itw = new I1(this.scene);
            itw.init(GLOBALS.WALL.TYPE.WEST,i);
            GameState.items[i + GameState.field_col * 2 + GameState.field_row] = itw;
        }
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

        // フロア数の表示位置
        this.ui_floor_pos.x = wc0.pos.x + GLOBALS.WALL.SIZE.THICK / 2;
        this.ui_floor_pos.y = wc0.pos.y + GLOBALS.WALL.SIZE.THICK / 2;

        // ★アイテム配置（固定位置：可視）
        this.set_box = false;
        if (floorInfo.fixed_items){
            for (const itemData of floorInfo.fixed_items){
                const { type, wall, loc } = itemData;
                let index = 0;
                if (wall === GLOBALS.WALL.TYPE.NORTH){
                    index = loc;
                } else if (wall === GLOBALS.WALL.TYPE.SOUTH){
                    index = loc + GameState.field_col;
                } else if (wall === GLOBALS.WALL.TYPE.EAST){
                    index = loc + GameState.field_col * 2;
                } else if (wall === GLOBALS.WALL.TYPE.WEST){
                    index = loc + GameState.field_col * 2 + GameState.field_row;
                }

                let ItemClass = I1;
                if (type === GLOBALS.ITEM.TYPE.BOX){
                    if (GameState.item_boxes[GameState.floor] === true){
                        continue;
                    } else {
                        ItemClass = I2;
                        this.set_box = true;
                    }
                } else if (type >= GLOBALS.ITEM.TYPE.LAUNCHER_MIN && type <= GLOBALS.ITEM.TYPE.LAUNCHER_MAX){
                    ItemClass = I3;
                } else if (type >= GLOBALS.ITEM.TYPE.GENERATOR_MIN && type <= GLOBALS.ITEM.TYPE.GENERATOR_MAX){
                    ItemClass = I4;
                }
                GameState.items[index] = new ItemClass(this.scene);
                GameState.items[index].init2(index);
                GameState.items[index].set_type(type);
                GameState.items[index].set_visible(true);
            }
        }

        // ★アイテム配置（ランダム位置：不可視）
        if (floorInfo.items){
            for (const itemData of floorInfo.items) {
                const { type } = itemData;
                if (type >= GLOBALS.ITEM.TYPE.GENERATOR_MIN && type <= GLOBALS.ITEM.TYPE.GENERATOR_MAX){
                    const item = this.place_item(type, I4);
                    item.isOneTime = true;
                } else {
                    this.place_item(type, I1);
                }
            }
        }

        if ((this.set_box === false ) && (GameState.item_boxes[GameState.floor] === false)){
            // 宝箱を固定位置に設定しておらず、かつ、この面の宝箱を取得済みで無い場合、ランダム配置
            this.place_item(GLOBALS.ITEM.TYPE.BOX, I2);
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
            const EnemyClass = enemyClassMap[tribe];
            const e = new EnemyClass(this.scene);
            const pos = MyMath.get_pos_from_loc(x, y);
            e.init(type, new Phaser.Math.Vector2(pos.pos_x, pos.pos_y));
            // dir が設定されている場合、その方向に１ドット進める
            // （※交差点にいると方向転換してしまうため）
            if (dir != null){
                e.set_dir(dir);
                if (dir === GLOBALS.DIR.UP){
                    e.pos.y -= 1;
                } else if (dir === GLOBALS.DIR.DOWN){
                    e.pos.y += 1;
                } else if (dir === GLOBALS.DIR.LEFT){
                    e.pos.x -= 1;
                } else if (dir === GLOBALS.DIR.RIGHT){
                    e.pos.x += 1;
                }
            } 
            GameState.enemies.push(e);
        }

        // フロア表示
        this.ui_floor = this.scene.add.text(this.ui_floor_pos.x, this.ui_floor_pos.y, '99', style).setOrigin(0.5,0.5);
        this.show_floor();

        // BGMの設定
        // console.log("bgm:", GameState.floor);
        if (GameState.floor === 59){
            GameState.bgm_set(GameState.sound.bgm_zero_mind);
        } else {
            GameState.bgm_set(GameState.sound.bgm_main);
        }
    }

    place_item(type, item_class){
        const empty_list = []
        for (let i = 0; i < GameState.items.length; i++){
            if (GameState.items[i].type === GLOBALS.ITEM.TYPE.NONE){
                empty_list.push(i);
            }
        }
        if (empty_list.length === 0){
            return null;
        }
        const random_index = Math.floor(Math.random() * empty_list.length);
        const index = empty_list[random_index];

        GameState.items[index] = new item_class(this.scene);
        GameState.items[index].init2(index);
        GameState.items[index].set_type(type);
        return GameState.items[index];
    }

    show_floor(){
        // フロア数表示
        this.ui_floor.setText(GameState.floor).setColor(GameState.item_boxes[GameState.floor]?'#808080':'#ff8080');
    }

    update(){
        // 背景のアニメーション
        this.bgFrameTimer -= 1;
        if (this.bgFrameTimer <= 0){
            this.bgFrame = (this.bgFrame + 1) % NUM_BG_FRAMES;
            this.bgs.forEach((tile, index) => {
                tile.setVisible(index === this.bgFrame);
            });
            this.bgFrameTimer = bgFramePeriods[this.bgFrame];
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

        // フロア数表示
        if ( this.ui_floor ){
            this.ui_floor.destroy();
            this.ui_floor = null;
        }

        // 背景
        if (this.bg){
            this.bg.destroy();
        }
        if (this.bgs.length > 0){
            for (let i = 0 ; i < this.bgs.length ; i++){
                this.bgs[i].destroy();
            }
        }
    }
}