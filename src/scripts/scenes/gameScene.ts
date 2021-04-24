import Grid from '../grid/grid';
import mapData from '../maps/default.json';

export default class GameScene extends Phaser.Scene {
    grid: Grid;
    addingNewRoute = false;

    modeText: Phaser.GameObjects.Text;
    potentialStopMarkers: Phaser.GameObjects.Group;

    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.add.sprite(0, 0, 'map').setOrigin(0);

        this.grid = new Grid();
        this.grid.loadFromJSON(mapData);

        this.potentialStopMarkers = this.add.group()
        this.grid.nodes.filter(
            node => node.canBeBusstop
        ).forEach((node) => {
            const marker = this.add.sprite(node.x+2,node.y-10,'stopPin');
        })

        this.modeText = this.add.text(400, 10, '');
        //some new route button
        this.add
            .rectangle(256, 10, 48, 22, 0x00ff00)
            .setInteractive()
            .on('pointerdown', pointer => {
                this.addingNewRoute = true;
                this.modeText.setText('adding route');
                //add markers on potential bus stops
                const potentialStops = this.grid.nodes.filter(
                    node => node.canBeBusstop
                );
            });

        this.input.keyboard.addKey('ESC').on('down', evt => {
            if (this.addingNewRoute) {
                this.addingNewRoute = false;
                this.modeText.setText('');
                
            }
        });
    }
}
