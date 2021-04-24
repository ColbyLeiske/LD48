import mapData from '../maps/default.json';
import FpsText from '../objects/fpsText';
import Grid from '../grid/grid';
import Node from '../grid/node';

export default class EditorScene extends Phaser.Scene {
    fpsText: FpsText;
    grid: Grid;

    editing: boolean;
    editedStartNode: Node;

    constructor() {
        super({ key: 'editorScene' });
    }

    create() {
        // new PhaserLogo(this, this.cameras.main.width / 2, 0)
        this.grid = new Grid();
        this.add.sprite(0, 0, 'map').setOrigin(0);

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

            const touchX = this.input.activePointer.worldX;
            const touchY = this.input.activePointer.worldY;
            const newNode = new Node(
              Math.round(touchX),
              Math.round(touchY),
              this.grid.nodes.length
          )
            this.grid.addNode(
              newNode
            );

            this.addNode(touchX, touchY,newNode.id);
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
              return
            }
            this.cameras.main.scrollX -=
                (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
            this.cameras.main.scrollY -=
                (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
        });

        this.fpsText = new FpsText(this);
    }

    private addNode(x: number, y: number, id:number, color: number = 0xff0000) {
        const cir = this.add.circle(x, y, 5, color).setInteractive();
        this.add.text(x,y,id.toString(),{ color: 'black', fontSize: '12px' }).setOrigin(0)
        cir.on('pointerdown', pointer => {
            const editKey = this.input.keyboard.addKey('E');
            if (editKey.isDown) {
                if (this.editing) {
                    const curNode = this.grid.getNode(pointer);
                    if (curNode.id == -1) {
                        return;
                    }
                    this.grid.addConnection(this.editedStartNode, curNode);
                    this.addConnection(this.editedStartNode, curNode);
                    this.editedStartNode = new Node(-1, -1, -1);
                    this.editing = false;
                    console.log('not editing anymore');
                    return;
                }
                console.log('now editing');
                this.editing = true;
                this.editedStartNode = this.grid.getNode(pointer);
            }
            const inspectKey = this.input.keyboard.addKey('V');
            if (inspectKey.isDown) {
                console.log(this.grid.getNode(pointer));
            }

            const noBusStopKey = this.input.keyboard.addKey('B');
            if (noBusStopKey.isDown) {
                const node = this.grid.getNode(pointer);
                this.grid.nodes[node.id].canBeBusstop = !this.grid.nodes[
                    node.id
                ].canBeBusstop;
            }
        });
    }

    private addConnection(nodeA: Node, nodeB: Node) {
        return this.add
            .line(
                nodeA.x,
                nodeA.y,
                0,
                0,
                -1 * (nodeA.x - nodeB.x),
                -1 * (nodeA.y - nodeB.y),
                0x0000ff
            )
            .setOrigin(0)
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
