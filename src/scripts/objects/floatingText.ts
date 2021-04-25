export default class FloatingText extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, x, y, text: string) {
        super(scene, x, y - 10, text, { color: 'black', fontSize: '12px' });
        scene.add.existing(this);
        scene.tweens.add({
            targets: this,
            ease: 'Quadratic.In',
            y: this.y - 10,
            alpha: 0,
            onComplete: () => {
                this.destroy();
            },
        });
        this.setOrigin(0).setDepth(999);
    }
}
