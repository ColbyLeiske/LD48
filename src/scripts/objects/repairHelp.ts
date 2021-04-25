export default class RepairHelp extends Phaser.GameObjects.Group {
    constructor(scene: Phaser.Scene) {
        super(scene);
        scene.add.existing(this);
        this.setOrigin(0);

        const screenDark = scene.add.rectangle(0,0,1280,720,0,.5).setOrigin(0)
        const background = scene.add.rectangle(1280/2,720/2,300,200,0xbbbbbb)
        const header = scene.add.text(1280/2-20,720/2 - 75,'Uh-Oh!')
        const goal = scene.add.text(1280/2-130,720/2-30,' Your bus has broken down!')
        const getStarted = scene.add.text(1280/2-139,720/2 + 15,'This will happen occasionally.\n Click the wrench to repair\n  them and resume service.');
        this.addMultiple([background,screenDark,header,goal,getStarted])
        this.getChildren().forEach((child) => {
            child.setInteractive()
            child.on('pointerdown',(evt) => {
                console.log('sahtkjldhfg')
                this.setActive(false).setVisible(false).destroy()
            })
        })
        this.setDepth(1001);
    }
}