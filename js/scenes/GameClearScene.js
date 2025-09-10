// GameClearScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { Ranking } from './ranking.js';
import { Sentences } from '../utils/DrawUtils.js';

const CLEAR_SENTENCE =["${0xff8000}ZEE${0x20ffd0} fell silent,",
    "and the ${0xff2000}MECHANICAL BUILDING",
    "ceased functioning.",
    "Humanity was",
    "spared annihilation,",
    "and gained",
    "time to rebuild.",
    "At the last moment,",
    "she learned ${0xff8000}ZEE${0x20ffd0}'s",
    "true purpose..."];

export class GameClearScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameClearScene' });
    }

    create() {
        this.cx = this.game.canvas.width / 2;
        this.cy = this.game.canvas.height / 2;
        this.sx = this.game.canvas.width;
        this.sy = this.game.canvas.height;
        this.add.text(this.cx, 60, 'GAME CLEAR', { fontSize: '64px', fill: '#ffffff' , stroke: GLOBALS.COLOR.RED, strokeThickness: 2}).setOrigin(0.5,0.5);

        // ヒロイン
        const h_x = this.sx - 350;
        const h_y = this.sy - 600;
        this.add.image(h_x,h_y,'ed_1').setOrigin(0,0).setDepth(1);
        this.sprite = this.add.sprite(h_x + 100, h_y + 100, 'ss_ed_1').setOrigin(0, 0).setDepth(2);
        if (!this.anims.exists('ss_ed_1_anims')) {
            this.anims.create({key:'ss_ed_1_anims',
                frames: [ 
                    { key: 'ss_ed_1', frame: 0, duration: 3000},
                    { key: 'ss_ed_1', frame: 1, duration: 100},
                    { key: 'ss_ed_1', frame: 2, duration: 100},
                    { key: 'ss_ed_1', frame: 1, duration: 100},
                ],
                repeat: -1
            });
        }
        this.sprite.play('ss_ed_1_anims');

        // パーティクル
        let graphics = this.make.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 0, 8, 8);
        graphics.generateTexture('confetti', 8, 8);
        this.confettiEmitter = this.add.particles(0, 0, 'confetti', {
            x: { min: 0, max: this.sx },
            y: 0,
            lifespan: 4000,
            speedY: { min: 40, max: 80 },
            speedX: { min: -50, max: 50 },
            angle: { min: 240, max: 300 },
            gravityY: 30,
            scale: { start: 0.6, end: 0.6 },
            rotate: { min: 0, max: 360 },
            alpha: { start: 1, end: 0 },
            quantity: 4,
            frequency: 100,
            blendMode: 'NORMAL',
            tint: [0xff9999, 0x99ccff, 0xffff99, 0xcc99ff, 0x99ffcc]
        });

        this.sentenceMgr = new Sentences(this, 
            CLEAR_SENTENCE,
            { speed: 5,
              posY: 150,
              baseColor: 0x20ffd0,
                onFinished: () => {
                    this.time.addEvent({
                        delay: 8000,
                        callback: () => {
                            this.goto_next();
                        },
                    callbackScope: this
                    }); // End of AddEvent
                } // End of onFinished
        }); // End of new Sentences

        GameState.sound.bgm_game_clear.play();
    }

    goto_next(){
        GameState.sound.bgm_game_clear.stop();
        if (Ranking.get_new_rank(GameState.ranking.session, GameState.score) === -1){
            this.scene.start('TitleScene');
        } else {
            this.scene.start('NameEntryScene');
        }
    }

    update(time, delta){
        this.sentenceMgr.update();
    }

}