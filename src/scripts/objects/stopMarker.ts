export default class StopMarker extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, color, public id) {
        super(scene, x, y, 'pin');
        this.setTintFill(color);
        scene.add.existing(this);
    }

    public update() {
        // in cents
    }
}
