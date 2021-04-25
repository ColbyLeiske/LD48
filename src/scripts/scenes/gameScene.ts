import Grid from '../grid/grid';
import mapData from '../maps/default.json';
import MoneyText from '../objects/moneyText';
import StopMarker from '../objects/stopMarker';
import Node from '../grid/node';

import _ from 'lodash';
import Bus from '../objects/bus';

export default class GameScene extends Phaser.Scene {
    grid: Grid;
    addingNewRoute = false;

    newRouteButton: Phaser.GameObjects.Rectangle;

    modeText: Phaser.GameObjects.Text;
    potentialStopMarkers: Phaser.GameObjects.Group;

    potentialFirstStop: Phaser.GameObjects.Sprite | undefined;

    routes: any[] = [];
    busses: Bus[] = [];
    money = 500;
    moneyText: MoneyText;

    colors: number[] = [
        0x1ea362,
        0x4a89f3,
        0x506487,
        0x57cac6,
        0xbcda6e,
        0xf3716f,
        0xd34f59,
    ];

    frameTime = 0;

    stopCost = 200;
    baseStopCost = 250;

    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.add.sprite(0, 0, 'map').setOrigin(0);
        this.moneyText = new MoneyText(this);
        const swapKey = this.input.keyboard.addKey('Q')
        swapKey.on('down',(evt) => {
          this.scene.start('editorScene')
        })
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
                    const inspectKey = this.input.keyboard.addKey('V');
                    if (inspectKey.isDown) {
                        console.log(this.grid.getNode(pointer));
                        return;
                    }

                    if (this.potentialFirstStop === marker) {
                        this.potentialFirstStop = undefined;
                        marker.clearTint();
                        this.potentialStopMarkers
                            .setVisible(true)
                            .setActive(true);
                        return;
                    }
                    //about to finalize new route
                    if (this.potentialFirstStop) {
                        //we have picked our two stops
                        //create a route here

                        const color = _.sample(this.colors);
                        console.log(color);
                        const pinA = new StopMarker(
                            this,
                            this.potentialFirstStop.x - 2,
                            this.potentialFirstStop.y - 2,
                            color
                        );
                        const pinB = new StopMarker(
                            this,
                            marker.x - 2,
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
                        const route = {
                            pinA,
                            pinB,
                            routeLines,
                            id: this.routes.length,
                            locations: locationsToDraw,
                        };
                        this.routes.push();
                        this.potentialFirstStop.setData('isBusStop', true);
                        marker.setData('isBusStop', true);
                        this.potentialStopMarkers.remove(marker, true);
                        this.potentialStopMarkers.remove(
                            this.potentialFirstStop,
                            true
                        );
                        this.toggleNewRoute();
                        this.editMoney(-this.stopCost);
                        //spawn our bus and get it to start making money
                        this.busses.push(new Bus(this, route));
                        return;
                    }

                    //we are picking this stop first
                    this.potentialFirstStop = marker;
                    marker.setTint(0xaaaa00);
                    marker.tintFill = true;

                    const minDistance = 2;// technically in screen space and eucledian distance

                    const suitableEnds = this.grid.getNodesInRange(
                        node,
                        minDistance
                    );
                    console.log(`within range ${JSON.stringify(suitableEnds)}`)
                    // const prunedEnds = suitableEnds.filter(node => {
                    //     console.log(
                    //         `pathing between ${this.potentialFirstStop?.getData(
                    //             'nodeid'
                    //         )} and ${node.id}`
                    //     );
                    //     return (
                    //         this.grid.getPathById(
                    //             this.potentialFirstStop?.getData('nodeid'),
                    //             node.id
                    //         ).length != 0
                    //     );
                    // });
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
        this.newRouteButton = this.add
            .rectangle(1200, 685, 120, 42, 0x00ff00)
            .setInteractive()
            .on('pointerdown', pointer => {
                this.toggleNewRoute();
            });
        this.add.text(1160, 677, 'New Route').setColor('black');
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
            .setOrigin(0)
            .setLineWidth(2);
    }

    public editMoney(amountToAdd) {
        console.log('updating money');
        this.money += amountToAdd;

        if (this.money < this.stopCost) {
            this.newRouteButton.setActive(false);
            this.newRouteButton.setFillStyle(0xaaaaaa);
        } else {
            this.newRouteButton.setActive(true);
            this.newRouteButton.setFillStyle(0x00ff00);
        }
    }

    update(time, delta) {
        this.moneyText.update(this.money);

        this.frameTime += delta;

        if (this.frameTime > 16.5) {
            this.frameTime = 0;

            // Code that relies on a consistent 60 update per second
        }
    }
}
