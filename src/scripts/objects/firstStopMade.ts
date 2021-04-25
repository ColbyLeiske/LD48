export default class FirstMadeHelp extends Phaser.GameObjects.Group {
    constructor(scene: Phaser.Scene) {
        super(scene);
        scene.add.existing(this);
        this.setOrigin(0);

        const screenDark = scene.add.rectangle(0,0,1280,720,0,.5).setOrigin(0)
        const background = scene.add.rectangle(1280/2,720/2,300,200,0xbbbbbb)
        const header = scene.add.text(1280/2-90,720/2 - 75,'Your First Route!')
        const goal = scene.add.text(1280/2-138,720/2-40,' Continue to let this route \nrun while you accumulate cash')
        const getStarted = scene.add.text(1280/2-137,720/2 + 15,'Creating new routes will cost\n more money the further they\n   are from your starting \n          location');
        this.addMultiple([background,screenDark,header,goal,getStarted])
        this.getChildren().forEach((child) => {
            child.setInteractive()
            child.on('pointerdown',(evt) => {
                console.log('sahtkjldhfg')
                this.setActive(false).setVisible(false)
            })
        })
        this.setDepth(1000);
    }
}