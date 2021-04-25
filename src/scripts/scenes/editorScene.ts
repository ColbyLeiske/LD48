import mapData from '../maps/default.json';
import FpsText from '../objects/fpsText';
import Grid from '../grid/grid';
import Node from '../grid/node';

export default class EditorScene extends Phaser.Scene {
    fpsText: FpsText;
    grid: Grid;

    editing: boolean;
    editedStartNode: Node;

    lines = new Map();

    constructor() {
        super({ key: 'editorScene' });
    }

    create() {
        // new PhaserLogo(this, this.cameras.main.width / 2, 0)
        this.grid = new Grid();
        this.add.sprite(0, 0, 'map').setOrigin(0);

        const swapKey = this.input.keyboard.addKey('Q');
        swapKey.on('down', evt => {
            this.scene.start('GameScene');
        });
        this.add
            .rectangle(256, 16, 32, 16, 0x00ff00)
            .setInteractive()
            .on('pointerdown', pointer => {
                this.grid.dump();
            });

        this.add
            .rectangle(256 * 2, 16, 32, 16, 0xf0f00f)
            .setInteractive()
            .on('pointerdown', pointer => {
                this.grid.loadFromJSON(mapData);
                this.grid.nodes.forEach(node => {
                    const color = node.canBeBusstop ? 0x00ff00 : 0xff0000;
                    this.addNode(node.x, node.y, node.id, color);
                });
                this.grid.edges.forEach(con => {
                    this.addConnection(
                        this.grid.getNodeById(con.source),
                        this.grid.getNodeById(con.dest)
                    );
                });
            });

        this.input.on('pointerdown', pointer => {
            const key = this.input.keyboard.addKey('SPACE');
            if (key.isUp) {
                return;
            }
            const gkey = this.input.keyboard.addKey('G');


            const touchX = this.input.activePointer.worldX;
            const touchY = this.input.activePointer.worldY;
            const newNode = new Node(
                Math.round(touchX),
                Math.round(touchY),
                this.grid.nodes.length,
                gkey.isUp,//bus stoppable by default
            );
            const color = newNode.canBeBusstop ? 0x00ff00 : 0xff0000;

            this.grid.addNode(newNode);

            this.addNode(touchX, touchY, newNode.id,color);
        });

        this.input.on(
            'wheel',
            (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                this.cameras.main.setZoom(
                    // Math.min(Math.max(1.4, this.cameras.main.zoom - deltaY / 500), 3)
                    this.cameras.main.zoom - deltaY / 100
                );
                console.log({ zoom: this.cameras.main.zoom });
            }
        );

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!pointer.isDown) {
                return;
            }
            const editKey = this.input.keyboard.addKey('C');
            if (!editKey.isDown) {
                return;
            }
            this.cameras.main.scrollX -=
                (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
            this.cameras.main.scrollY -=
                (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
        });

        this.fpsText = new FpsText(this);
    }

    private addNode(
        x: number,
        y: number,
        id: number,
        color: number = 0xff0000
    ) {
        const cir = this.add.circle(x, y, 5, color).setInteractive();
        this.add
            .text(x, y, id.toString(), { color: 'black', fontSize: '12px' })
            .setOrigin(0);
        cir.on('pointerdown', pointer => {
            const editKey = this.input.keyboard.addKey('E');
            const touchX = this.input.activePointer.worldX;
            const touchY = this.input.activePointer.worldY;
            const coords = {x:touchX,y:touchY}
            if (editKey.isDown) {
                if (
                    this.editing &&
                    this.editedStartNode === this.grid.getNode(coords)
                ) {
                    this.editedStartNode = new Node(-1, -1, -1);
                    this.editing = false;
                    console.log('not editing anymore');
                    return;
                }
                if (this.editing) {
                    const curNode = this.grid.getNode(coords);
                    if (curNode.id == -1) {
                        console.log('early return');
                        return;
                    }
                    const weight = Math.round(
                        Math.max(
                            Math.sqrt(
                                Math.pow(
                                    this.editedStartNode.x - curNode.x,
                                    2
                                ) +
                                    Math.pow(
                                        this.editedStartNode.y - curNode.y,
                                        2
                                    )
                            ),
                            1
                        )
                    );
                    const edge = this.grid.edges.filter(({ dest, source }) => {
                        return (
                            (this.editedStartNode.id == source &&
                                curNode.id == dest) ||
                            (this.editedStartNode.id == dest &&
                                curNode.id == source)
                        );
                    });
                    if (edge.length) {

                        console.log('truying to remove edge');
                        //remove connection and dip
                        this.grid.edges = this.grid.edges.filter(({ dest, source }) => {
                          return !(
                              (this.editedStartNode.id == source &&
                                  curNode.id == dest) ||
                              (this.editedStartNode.id == dest &&
                                  curNode.id == source)
                          );
                      });
                        console.log(`trying `, {
                            a: this.editedStartNode.id,
                            b: curNode.id,
                        });
                        console.log('lines:', this.lines);
                        this.lines
                            .get(
                                JSON.stringify({
                                    a: this.editedStartNode.id,
                                    b: curNode.id,
                                })
                            )
                            ?.setVisible(false)
                            .destroy();
                        this.lines
                            .get(
                                JSON.stringify({
                                    a: curNode.id,
                                    b: this.editedStartNode.id,
                                })
                            )
                            ?.setVisible(false)
                            .destroy();
                        this.lines.delete(
                            JSON.stringify({
                                a: this.editedStartNode.id,
                                b: curNode.id,
                            })
                        );
                        this.lines.delete(
                            JSON.stringify({
                                a: curNode.id,
                                b: this.editedStartNode.id,
                            })
                        );
                        this.editedStartNode = new Node(-1, -1, -1);
                        this.editing = false;
                        return;
                    }

                    this.grid.addConnection(
                        this.editedStartNode,
                        curNode,
                        weight
                    );
                    this.addConnection(this.editedStartNode, curNode);
                    this.editedStartNode = new Node(-1, -1, -1);
                    this.editing = false;
                    console.log('not editing anymore');
                    return;
                }
                console.log('now editing');
                this.editing = true;
                this.editedStartNode = this.grid.getNode(coords);
            }
            const inspectKey = this.input.keyboard.addKey('V');
            if (inspectKey.isDown) {
                console.log(this.grid.getNode(coords));
            }

            const noBusStopKey = this.input.keyboard.addKey('B');
            if (noBusStopKey.isDown) {
                const node = this.grid.getNode(coords);
                this.grid.nodes[node.id].canBeBusstop = !this.grid.nodes[
                    node.id
                ].canBeBusstop;
            }
        });
    }

    private addConnection(nodeA: Node, nodeB: Node) {
        const line = this.add
            .line(
                nodeA.x,
                nodeA.y,
                0,
                0,
                -1 * (nodeA.x - nodeB.x),
                -1 * (nodeA.y - nodeB.y),
                0x0000ff
            )
            .setOrigin(0);
        this.lines.set(JSON.stringify({ a: nodeA.id, b: nodeB.id }), line);
        return;
        // .setInteractive()
        // .on('pointerdown', pointer => {
        //     const newWeight = prompt('enter new weight of connection', '');
        //     if (!newWeight) return
        //     this.grid.updateEdgeWeight(nodeA, nodeB, +newWeight);
        // });
    }

    update() {
        this.fpsText.update();
    }
}
