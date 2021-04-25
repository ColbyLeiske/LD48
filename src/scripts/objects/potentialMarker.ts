import GameScene from '../scenes/gameScene';

export default class PotentialStopMarker extends Phaser.GameObjects.Sprite {
    scene: GameScene;
    constructor(scene, public x, public y, public cost, public nodeid) {
        super(scene, x, y, 'stopPin');
        this.scene = scene;
        this.setInteractive().setDataEnabled().setData('nodeid', nodeid);
        this.scene.add.existing(this);
    }

    public onMoneyUpdate(newMoney) {
        // in cents
        if (newMoney < this.cost) {
            this.setTexture('noMoneyPin');
        } else {
            this.setTexture('stopPin');
        }
    }
}
