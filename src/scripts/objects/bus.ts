import { Tweens } from 'phaser';
import GameScene from '../scenes/gameScene';
import FloatingText from './floatingText';
import RepairHelp from './repairHelp';

export default class Bus extends Phaser.GameObjects.Sprite {
    ticks = 0;
    timeTillBreakdownChance = 60 * 15; // 1 second times 15 seconds
    tweenTimeline: Phaser.Tweens.Timeline;
    breakdownThreshold = 50;

    repairWrench: Phaser.GameObjects.Sprite;
    repairTween: Phaser.Tweens.Tween;
    isBrokenDown = false;

    constructor(public scene: GameScene, public route) {
        super(scene, route.locations[0][0], route.locations[0][1], 'bus');
        this.setAngle(-2.5).setDepth(5);
        this.repairWrench = scene.add
            .sprite(this.x, this.y, 'repair')
            .setInteractive()
            .on('pointerdown', pointer => {
                //repairing bus here
                if (!this.isBrokenDown) return;

                this.isBrokenDown = false;
                this.tweenTimeline.resume();
                new FloatingText(scene, this.x, this.y, 'Repaired!');
                scene.add.tween({
                    targets: this.repairWrench,
                    alpha: 0,
                    onComplete: () => {
                        this.repairWrench.setActive(false).setVisible(false);
                    },
                });
            })
            .setAngle(75)
            .setDepth(10)
            .setActive(false)
            .setVisible(false);
        this.repairTween = scene.add.tween({
            targets: this.repairWrench,
            scale: 1.3,
            yoyo: true,
            loop: -1,
        });
        // .setActive(false).setVisible(false)
        this.tweenTimeline = scene.tweens.createTimeline({
            loop: -1,
        });

        const onUpdate = (
            tween: Phaser.Tweens.Tween,
            target: Phaser.GameObjects.GameObject
        ) => {
            this.repairWrench.setX(tween.getValue(0));
            this.repairWrench.setY(tween.getValue(1) - 25);
        };

        let totalDistance = 0;
        for (let i = 1; i < route.locations.length; i++) {
            const [x1, y1] = route.locations[i - 1];
            const [x2, y2] = route.locations[i];
            const distance = Phaser.Math.Distance.Between(x1, y1, x2, y2);
            totalDistance += distance;
            this.tweenTimeline.add({
                targets: this,
                x: x2,
                y: y2,
                ease: 'linear',
                duration: 500 + distance * 15,
                onUpdate,
            });
        }

        for (let i = route.locations.length - 1; i > 0; i--) {
            const [x1, y1] = route.locations[i - 1];
            const [x2, y2] = route.locations[i];
            let onComplete = () => {};
            if (i - 1 === 0) {
                onComplete = () => {
                    const amountMade = Math.trunc(totalDistance / 4);
                    (scene as GameScene).editMoney(amountMade);
                    new FloatingText(scene, x1, y1, `+ $${amountMade}`); // JUUUIIIIICCCCEEE
                };
            }
            this.tweenTimeline.add({
                targets: this,
                x: x1,
                y: y1,
                ease: 'linear',
                duration:
                    500 + Phaser.Math.Distance.Between(x1, y1, x2, y2) * 15,
                onComplete,
                onUpdate,
            });
        }
        this.tweenTimeline.add({
            targets: this,
            duration: 250,
        });
        this.tweenTimeline.play();

        scene.add.existing(this);
    }

    public tick() {
        if (this.isBrokenDown) return;
        this.ticks++;
        if (this.ticks >= this.timeTillBreakdownChance) {
            const didBreakdown =
                this.randomInteger(1, 100) > this.breakdownThreshold;
            this.timeTillBreakdownChance = this.randomInteger(60 * 10, 60 * 20);

            console.log(didBreakdown);
            if (!didBreakdown) {
                return;
            }

            if (!this.scene.hasHadBreakdown) {
                this.scene.hasHadBreakdown = true;
                new RepairHelp(this.scene)
            }

            console.log('bus broke down');
            //we broke down
            this.tweenTimeline.pause();
            this.isBrokenDown = true;
            this.repairWrench.setActive(true).setVisible(true);
            this.scene.add.tween({
                targets: this.repairWrench,
                alpha: 1,
            });
            this.ticks = 0;
        }
    }

    private randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
