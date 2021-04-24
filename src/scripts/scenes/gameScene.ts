import Grid from '../grid/grid';
import mapData from '../maps/default.json';

export default class GameScene extends Phaser.Scene {
    grid: Grid;
    addingNewRoute = false;

    modeText: Phaser.GameObjects.Text;
    potentialStopMarkers: Phaser.GameObjects.Group;

    potentialFirstStop: Phaser.GameObjects.Sprite | undefined;

    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.add.sprite(0, 0, 'map').setOrigin(0);

        this.grid = new Grid();
        this.grid.loadFromJSON(mapData);

        this.potentialStopMarkers = this.add.group();
        this.grid.nodes
            .filter(node => node.canBeBusstop)
            .forEach(node => {
                const marker = this.add
                    .sprite(node.x + 2, node.y - 10, 'stopPin')
                    .setInteractive();

                marker.on('pointerdown', pointer => {
                    if (this.potentialFirstStop === marker) {
                        this.potentialFirstStop = undefined;
                        marker.clearTint();
                        return;
                    }
                    if (this.potentialFirstStop) {
                        //we have picked our two stops
                        //create a route here
                        this.toggleNewRoute();
                        return;
                    }
                    //we are picking this stop first
                    this.potentialFirstStop = marker;
                    marker.tintFill = true;
                    marker.setTint(0x00aa00);
                    marker.tintFill = true;

                    // node.isBusstop = true;
                    // this.toggleNewRoute();
                });
                this.potentialStopMarkers.add(marker);
            });
        this.potentialStopMarkers.setVisible(false).setActive(false);

        this.modeText = this.add
            .text(400, 10, 'Adding Route')
            .setVisible(false);
        //some new route button
        this.add
            .rectangle(256, 10, 48, 22, 0x00ff00)
            .setInteractive()
            .on('pointerdown', pointer => {
                this.toggleNewRoute();
            });

        this.input.keyboard.addKey('ESC').on('down', evt => {
            if (this.addingNewRoute) {
                this.toggleNewRoute();
            }
        });
    }

    private toggleNewRoute() {
        this.addingNewRoute = !this.addingNewRoute;
        this.modeText.setVisible(this.addingNewRoute);
        this.potentialStopMarkers
            .setVisible(this.addingNewRoute)
            .setActive(this.addingNewRoute);

        this.potentialFirstStop = undefined;
        this.potentialStopMarkers.setTint(0xffffff);
    }
}
