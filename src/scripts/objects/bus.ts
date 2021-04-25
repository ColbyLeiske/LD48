import { Tweens } from 'phaser';
import GameScene from '../scenes/gameScene';
import MoneyMade from './moneyMade';

export default class Bus extends Phaser.GameObjects.Sprite {
    ticks = 0;
    tweenTimeline: Phaser.Tweens.Timeline;

    constructor(scene: Phaser.Scene, public route) {
        super(scene, route.locations[0][0], route.locations[0][1], 'bus');
        this.setScale(0.2);
        this.setAngle(-2.5).setZ(5)
        this.tweenTimeline = scene.tweens.createTimeline({
            loop: -1,
        });

        let totalDistance = 0;
        for (let i = 1; i < route.locations.length; i++) {
            const [x1, y1] = route.locations[i - 1];
            const [x2, y2] = route.locations[i];
            const distance = Phaser.Math.Distance.Between(x1, y1, x2, y2)
            totalDistance += distance
            this.tweenTimeline.add({
                targets: this,
                x: x2,
                y: y2,
                ease: 'linear',
                duration:
                    500 + distance * 15,
            });
        }

        for (let i = route.locations.length - 1; i > 0; i--) {
            const [x1, y1] = route.locations[i - 1];
            const [x2, y2] = route.locations[i];
            let onComplete = () => {};
            if (i - 1 === 0) {
                onComplete = () => {
                    
                    const amountMade =Math.trunc(totalDistance/4 );
                    (scene as GameScene).editMoney(amountMade);
                    new MoneyMade(scene, x1, y1,amountMade); // JUUUIIIIICCCCEEE
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
            });
        }
        this.tweenTimeline.add({
            targets: this,
            duration: 250,
        });
        this.tweenTimeline.play();
        this.tweenTimeline.setCallback('onComplete', t => {
            console.log('done');
        });

        scene.add.existing(this);
    }

    public tick() {
        // in cents
    }
}
