// GameClearScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyInput } from '../utils/InputUtils.js';

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
        this.add.text(this.cx, this.cy + 120, 'PUSH SPACE KEY',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5,0.5).setDepth(2);
        this.add.text(this.cx, this.cy + 180, `Your Final SCORE is ${GameState.score}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5,0.5).setDepth(2);

        this.my_input = new MyInput(this);
        this.my_input.registerPadConnect(() => this.show_pad());
        if (this.my_input.pad){this.show_pad();}
        this.my_input.registerNextAction(() => this.goto_title());

        const btn_play = this.add.image(this.cx, this.cy, 'btn_tap')
        .setOrigin(0.5,0.5)
        .setInteractive()
        .on('pointerdown', () => {this.goto_title();})
        .on('pointerover', () => {btn_play.setTint(0xcccccc);})
        .on('pointerout', () => {btn_play.clearTint();});

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

    }

    show_pad(){
        this.add.text(this.cx, this.cy + 140, ' or PRESS START BUTTON',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
    }

    goto_title(){
        // GameState.sound.bgm_clear.stop();
        GameState.sound.se_tap.play();
        this.scene.start('TitleScene');
    }

    update(time, delta){
    }

}