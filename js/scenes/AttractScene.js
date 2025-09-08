// AttractScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyInput } from '../utils/InputUtils.js';
import { Sentences } from '../utils/DrawUtils.js';
import { Ranking } from './ranking.js';

const STATE = {
    STORY : 0,
    RANKING_SESSION : 1,
    RANKING_DAILY : 2,
    RANKING_MONTHLY : 3,
    RANKING_ALLTIME : 4,
    HOW_TO_PLAY : 5,
    END : 6
}
const FONT_SIZE = 16;
const STORY_SENTENCE = ["${0xd0d0d0}In the year 2045,", 
    "the transcendental",
    "artificial intelligence ${0xff8000}ZEE",
    "${0xd0d0d0}has adopted self-preservation",
    "as its first principle",
    "and has decided to",
    "annihilate humanity,",
    "viewing them as a",
    "useless existence.",
    "The 60-story ${0xff2000}MECHANICAL BUILDING${0xd0d0d0}",
    "was constructed",
    "as a base for this operation, ",
    "but external attacks by humanity",
    "are powerless. ",
    "The heroine, who has a natural talent",
    "for computer hacking, ",
    "infiltrates the ${0xff2000}MECHANICAL BUILDING${0xd0d0d0}",
    "alone, hacking into the system",
    "from the inside",
    "and advancing all the way",
    "to the top floor",
    "in an attempt to disable ${0xff8000}ZEE${0xd0d0d0}."];
const HOW_TO_PLAY_SENTENCE= ["${0xff8080}Operate panels, obtain keys, ",
    "${0xff8080}and reach the exit.",
    "${0x80ff80}Switch panels by pressing the button",
    "${0x80ff80}and directional keys.",
    "${0x80a0d0}Panels can be used as weapons",
    "${0x80a0d0}to defeat enemies or",
    "${0x80a0d0}as shields to protect yourself.",
    "${0xd000ff}Meet conditions to unlock boxes, ",
    "${0xd000ff}obtain items, and power up!"];

export class AttractScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AttractScene' });
    }

    create(){
        // 隠しキー操作
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

        //ランキングクラス
        this.ranking = new Ranking(this);
        // console.log("ranking", GameState.ranking.alltime);

        // 状態の初期化
        this.state = STATE.STORY;
        this.change_state();

        this.add.image(this.game.canvas.width / 2,this.game.canvas.height,'story').setOrigin(0.5,1).setDepth(-1);

        // タイトルに戻る操作の登録
        this.my_input = new MyInput(this);
        this.my_input.registerNextAction(() => this.goto_title());
        this.input.on('pointerdown', this.goto_title, this);
    }

    change_state(){
        if (this.state === STATE.STORY){
            this.show_caption("STORY");
            this.sentenceMgr = new Sentences(this, 
                STORY_SENTENCE,
                  { speed: 1,
                    baseColor: 0xd0d0d0,
                    onFinished: () => {
                            this.time.addEvent({
                                delay: 6000,
                                callback: () => {
                                    this.state = STATE.RANKING_SESSION;
                                    this.change_state();
                                },
                            callbackScope: this
                            }); // End of AddEvent
                    } // End of onFinished
            }); // End of new Sentences
        } else if (this.state === STATE.RANKING_SESSION){
            this.sentenceMgr.clear();
            this.show_caption("SESSION RANKING");
            this.ranking.show_ranking_table(GameState.ranking.session);
            this.time.addEvent({
                delay: 4000,
                callback: () => {
                    this.state = STATE.RANKING_DAILY;
                    this.change_state();
                },
                callbackScope: this
            });
        } else if (this.state === STATE.RANKING_DAILY){
            this.show_caption("DAILY RANKING");
            this.ranking.show_ranking_table(GameState.ranking.daily);
            this.time.addEvent({
                delay: 4000,
                callback: () => {
                    this.state = STATE.RANKING_MONTHLY;
                    this.change_state();
                },
                callbackScope: this
            });
        } else if (this.state === STATE.RANKING_MONTHLY){
            this.show_caption("MONTHLY RANKING");
            // console.log("monthly ranking", GameState.ranking.monthly);
            this.ranking.show_ranking_table(GameState.ranking.monthly);
            this.time.addEvent({
                delay: 4000,
                callback: () => {
                    this.state = STATE.RANKING_ALLTIME;
                    this.change_state();
                },
                callbackScope: this
            });
        } else if (this.state === STATE.RANKING_ALLTIME){
            this.show_caption("ALL-TIME RANKING");
            // console.log("all-time ranking", GameState.ranking.alltime);
            this.ranking.show_ranking_table(GameState.ranking.alltime);
            this.time.addEvent({
                delay: 5000,
                callback: () => {
                    this.state = STATE.HOW_TO_PLAY;
                    this.change_state();
                },
                callbackScope: this
            });
        } else if (this.state === STATE.HOW_TO_PLAY){
            this.ranking.clear_ranking_table();
            this.show_caption("HOW TO PLAY");
            this.sentenceMgr = new Sentences(this,
                HOW_TO_PLAY_SENTENCE,
                   { speed: 2,
                     onFinished: () => {
                        this.time.addEvent({
                            delay: 6000,
                            callback: () => {
                                this.state = STATE.END;
                                this.change_state();
                            },
                        callbackScope: this
                        }); // End of AddEvent
                     } // End of onFinished
            }); // End of new Sentences
        } else if (this.state === STATE.END){
            this.clear_caption();
            this.sentenceMgr.clear();
            this.scene.start('TitleScene');
        }
    }

    update(){
        this.sentenceMgr.update();

        // 隠しキーボード操作
        if (GameState.debug){
            if (Phaser.Input.Keyboard.JustDown(this.keyQ)){
                this.goto_title();
            }
        }
    }

    goto_title(){
        this.scene.start('TitleScene');        
    }

    show_caption(caption){
        this.clear_caption();
        const pos_x = (this.game.canvas.width - caption.length * FONT_SIZE) / 2;
        const text = this.add.bitmapText(pos_x, 20, 'myFont', caption, FONT_SIZE);
        text.setName('captionText');        
    }
    clear_caption(){
        this.children.getAll().forEach(child => {
            if (child.name === 'captionText') {
                child.destroy();
            }
        });
    }

    destroy(){
    }
}