// i2.js
// 宝箱
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Item } from './item.js';

export class I2 extends Item {

    constructor(scene){
        super(scene)
        // 宝箱用
        this.inner_type = GLOBALS.ITEM.TYPE.NONE;
    }

    init(wall, loc){
        super.init(wall, loc);
        // 宝箱用
        this.inner_type = GLOBALS.ITEM.TYPE.NONE;
    }

    set_inner_type(type){
        this.inner_type = type;
    }
}