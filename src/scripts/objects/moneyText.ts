export default class MoneyText extends Phaser.GameObjects.Text {
    constructor(scene) {
        super(scene, 1070, 20, '', { color: 'black', fontSize: '28px' });
        scene.add.existing(this);
        this.setOrigin(0);
    }

    public update(money) {
        // in cents
        this.setText(`Cash: $${money}`);
    }
}
