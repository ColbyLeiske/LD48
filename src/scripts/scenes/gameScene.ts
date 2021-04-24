import Grid from '../grid/grid';
import mapData from '../maps/default.json';
import MoneyText from '../objects/moneyText';
import StopMarker from '../objects/stopMarker';
import Node from '../grid/node';

import _ from 'lodash';

export default class GameScene extends Phaser.Scene {
    grid: Grid;
    addingNewRoute = false;

    modeText: Phaser.GameObjects.Text;
    potentialStopMarkers: Phaser.GameObjects.Group;

    potentialFirstStop: Phaser.GameObjects.Sprite | undefined;

    routes: any[] = [];

    money: number; // in cents?
    moneyText: MoneyText;

    colors: number[] = [
        0x1ea362,
        0xffe047,
        0x4a89f3,
        0xffeb99,
        0x506487,
        0x57cac6,
        0xbcda6e,
        0xf3716f,
        0xd34f59,
    ];

    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.add.sprite(0, 0, 'map').setOrigin(0);
        this.moneyText = new MoneyText(this);

        this.grid = new Grid();
        this.grid.loadFromJSON(mapData);

        this.potentialStopMarkers = this.add.group();
        this.grid.nodes
            .filter(node => node.canBeBusstop)
            .forEach(node => {
                const marker = this.add
                    .sprite(node.x + 2, node.y - 10, 'stopPin')
                    .setInteractive()
                    .setDataEnabled()
                    .setData('nodeid', node.id);

                marker.on('pointerdown', pointer => {
                    if (this.potentialFirstStop === marker) {
                        this.potentialFirstStop = undefined;
                        marker.clearTint();
                        this.potentialStopMarkers
                            .setVisible(true)
                            .setActive(true);
                        return;
                    }
                    if (this.potentialFirstStop) {
                        //we have picked our two stops
                        //create a route here
                        this.potentialFirstStop.setData('isBusStop', true);
                        marker.setData('isBusStop', true);
                        this.potentialStopMarkers.remove(marker, true);
                        this.potentialStopMarkers.remove(
                            this.potentialFirstStop,
                            true
                        );
                        const color = _.sample(this.colors);

                        const pinA = new StopMarker(
                            this,
                            this.potentialFirstStop.x,
                            this.potentialFirstStop.y - 2,
                            color
                        );
                        const pinB = new StopMarker(
                            this,
                            marker.x,
                            marker.y - 2,
                            color
                        );
                        const path = this.grid.getPathById(
                            this.potentialFirstStop.getData('nodeid'),
                            marker.getData('nodeid')
                        );
                        const locationsToDraw = path.map(node => {
                            return [node.x, node.y];
                        });
                        console.log(locationsToDraw);
                        let routeLines: Phaser.GameObjects.Line[] = [];
                        for (let i = 1; i < locationsToDraw.length; i++) {
                            const [x1, y1] = locationsToDraw[i - 1];
                            const [x2, y2] = locationsToDraw[i];
                            routeLines.push(
                                this.addLine(x1, y1, x2, y2, color)
                            );
                        }

                        this.routes.push({
                            stopA: this.potentialFirstStop,
                            stopB: marker,
                            pinA,
                            pinB,
                            routeLines,
                        });
                        this.toggleNewRoute();
                        return;
                    }
                    //we are picking this stop first
                    this.potentialFirstStop = marker;
                    marker.setTint(0xaaaa00);
                    marker.tintFill = true;

                    const minDistance = 5;
                    const suitableEnds = this.grid.getNodesFurtherThanDistance(
                        node,
                        minDistance
                    );
                    const suitableIds = suitableEnds.map(n => n.id);
                    // console.log(suitableIds)
                    this.potentialStopMarkers
                        .getChildren()
                        .filter(marker => {
                            const nodeid = marker.getData('nodeid');
                            return (
                                !suitableIds.includes(nodeid) &&
                                nodeid !=
                                    this.potentialFirstStop?.getData('nodeid')
                            );
                        })
                        .forEach(marker => {
                            // console.log(marker.getData('nodeid'))
                            marker.setActive(false);
                            (marker as Phaser.GameObjects.Sprite).setVisible(
                                false
                            );
                        });
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

    private addLine(x1, y1, x2, y2, color: number) {
        return this.add
            .line(x1, y1, 0, 0, -1 * (x1 - x2), -1 * (y1 - y2), color)
            .setOrigin(0);
    }

    update() {
        this.moneyText.update(this.money);
    }
}
