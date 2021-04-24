import { Tweens } from "phaser";

export default class Bus extends Phaser.GameObjects.Sprite {
    ticks = 0;
    tweenTimeline: Phaser.Tweens.Timeline;

    constructor(scene: Phaser.Scene, public route) {
        super(scene, route.locations[0][0],  route.locations[0][1], 'bus');
        this.setScale(.2)
        this.tweenTimeline = scene.tweens.createTimeline({
            loop: -1
        })
        for (let i = 1; i < route.locations.length; i++) {
            const [x1, y1] = route.locations[i - 1];
            const [x2, y2] = route.locations[i];
            this.tweenTimeline.add({
                targets:this,
                x:x2,
                y:y2,
                ease:"linear",
                duration: 500 + (Phaser.Math.Distance.Between(x1,y1,x2,y2)*15)
            })
        }
        for (let i = route.locations.length-1; i > 0; i--) {
            const [x1, y1] = route.locations[i - 1];
            const [x2, y2] = route.locations[i];
            this.tweenTimeline.add({
                targets:this,
                x:x1,
                y:y1,
                ease:"linear",
                duration: 500 + (Phaser.Math.Distance.Between(x1,y1,x2,y2)*15)
            })
        }
        this.tweenTimeline.play();

        scene.add.existing(this);
    }

    public tick() {
        // in cents
    }
}
