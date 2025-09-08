// i1.js
// 通常アイテム
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Item } from './item.js';

export class I1 extends Item {

    constructor(scene){
        super(scene);
    }

    init(wall, loc){
        super.init(wall, loc);
    }

}