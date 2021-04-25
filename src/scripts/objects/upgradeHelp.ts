export default class UpgradeHelp extends Phaser.GameObjects.Group {
    constructor(scene: Phaser.Scene) {
        super(scene);
        scene.add.existing(this);
        this.setOrigin(0);

        const screenDark = scene.add
            .rectangle(0, 0, 1280, 720, 0, 0.5)
            .setOrigin(0);
        const background = scene.add.rectangle(
            1280 / 2,
            720 / 2,
            300,
            200,
            0xbbbbbb
        );
        const header = scene.add.text(
            1280 / 2 - 90,
            720 / 2 - 75,
            'Upgrade your Fleet!'
        );
        const goal = scene.add.text(
            1280 / 2 - 115,
            720 / 2 - 40,
            ' Increase the speed and\nreliability of your buses'
        );
        const getStarted = scene.add.text(
            1280 / 2 - 102,
            720 / 2 + 15,
            'To upgrade, click the \nUpgrade Buses button'
        );
        this.addMultiple([background, screenDark, header, goal, getStarted]);
        this.getChildren().forEach(child => {
            child.setInteractive();
            child.on('pointerdown', evt => {
                this.setActive(false).setVisible(false).destroy();
            });
        });
        this.setDepth(1000);
    }
}
