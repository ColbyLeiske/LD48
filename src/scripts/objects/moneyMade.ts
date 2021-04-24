export default class MoneyMade extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, x, y) {
        super(scene, x, y-10, '+$100', { color: 'black', fontSize: '12px' });
        scene.add.existing(this);
        scene.tweens.add({
            targets: this,
            y: this.y - 10,
            alpha: 0,
            onComplete: () => {
                this.destroy();
            },
        });
        this.setOrigin(0);
    }

    public update(money) {
        // in cents
        this.setText(`+ $${money}`);
    }
}
