import GameScene from '../scenes/gameScene';
import FloatingText from './floatingText';

export default class PotentialStopMarker extends Phaser.GameObjects.Sprite {
    scene: GameScene;
    costText: Phaser.GameObjects.Text;
    constructor(scene, public x, public y, private cost, public nodeid) {
        super(scene, x, y, 'stopPin');
        this.scene = scene;
        this.setInteractive()
            .setDataEnabled()
            .setData('nodeid', nodeid)
            .setData('available', true);
        this.cost = Math.round(cost);
        this.costText = this.scene.add
            .text(x - 22, y - 25, `$${this.cost}`, {
                color: 'black',
                fontSize: '16px',
            })
            .setVisible(false)
            .setActive(false)
            .setAlpha(0)
            .setDepth(100);
        this.on('pointerdown', pointer => {
            if (this.getData('available')) return;
            new FloatingText(
                this.scene,
                pointer.x,
                pointer.y,
                'Insufficient Funds!'
            );
        });
        this.on('pointerover', pointer => {
            this.costText.setVisible(true).setActive(true);
            this.scene.tweens.add({
                targets: this.costText,
                alpha: 1,
                duration: 100,
            });
        });
        this.on('pointerout', pointer => {
            this.scene.tweens.add({
                targets: this.costText,
                alpha: 0,
                duration: 100,
                onComplete: () => {
                    this.costText.setVisible(false).setActive(false);
                },
            });
        });
        this.scene.add.existing(this);
    }

    public onMoneyUpdate(newMoney) {
        // in cents
        if (newMoney < this.cost) {
            this.setTexture('noMoneyPin');
            this.setData('available', false);
        } else {
            this.setTexture('stopPin');
            this.setData('available', true);
        }
    }

    public updateCost(newCost: number) {
        this.cost = Math.round(newCost);
        this.costText.setText(`$${this.cost}`);
    }

    public destroy(){
        
    }
}
