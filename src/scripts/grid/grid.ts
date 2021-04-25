import Node from './node';

export default class Grid {
    nodes: Node[] = [];
    edges: any[] = [];
    paths: any;
    weights: any;

    public addNode(node: Node) {
        this.nodes.push(node);
    }

    public addConnection(a: Node, b: Node, weight?: number) {
        // set both ways for bidirectional graph
        this.edges.push({
            source: a.id,
            dest: b.id,
            weight: weight || 100,
        });
        this.edges.push({
            source: b.id,
            dest: a.id,
            weight: weight || 100,
        });
    }

    public getConnections(node: Node) {
        return this.edges.filter(conn => {
            conn.source === node || conn.dest === node;
        });
    }

    public doesConnectionExist(a: Node, b: Node, weight) {
        return this.edges.includes;
    }

    public getNode({ x: dx, y: dy }) {
        const tempRadius = 5;
        const potentialNodes = this.nodes.filter(({ x, y }) => {
            return (
                Math.abs(dx - x) < tempRadius && Math.abs(dy - y) < tempRadius
            );
        });
        if (potentialNodes.length >= 1) return potentialNodes[0];

        return new Node(-1, -1, -1);
    }

    public getNodeById(id: number) {
        return this.nodes[id];
    }

    public getNodesInRadius(dx: number, dy: number, radius: number) {
        return this.nodes.filter(({ x, y }) => {
            return Math.abs(dx - x) < radius && Math.abs(dy - y) < radius;
        });
    }

    //https://www.tutorialspoint.com/The-Floyd-Warshall-algorithm-in-Javascript
    public floydWarshallAlgorithm() {
        const dist = Array(this.nodes.length)
            .fill(null)
            .map(() => {
                return Array(this.nodes.length).fill(Infinity);
            });
        const next = Array(this.nodes.length)
            .fill(null)
            .map(() => {
                return Array(this.nodes.length).fill(undefined);
            });

        this.nodes.forEach((startNode, startIndex) => {
            this.nodes.forEach((endNode, endIndex) => {
                if (startNode === endNode) {
                    dist[startIndex][endIndex] = 0;
                } else {
                    const edge = this.edges.filter(edges => {
                        return (
                            edges.source === startNode.id &&
                            edges.dest === endNode.id
                        );
                    });
                    if (edge.length) {
                        const rEdge = edge[0];
                        dist[startIndex][endIndex] = rEdge.weight;
                        next[startIndex][endIndex] = startNode.id;
                    } else {
                        dist[startIndex][endIndex] = Infinity;
                    }
                }
            });
        });

        this.nodes.forEach((middleVertex, middleIndex) => {
            // Path starts from startVertex with startIndex.
            this.nodes.forEach((startVertex, startIndex) => {
                // Path ends to endVertex with endIndex.
                this.nodes.forEach((endVertex, endIndex) => {
                    // Compare existing distance from startVertex to endVertex, with distance
                    // from startVertex to endVertex but via middleVertex.
                    // Save the shortest distance and previous vertex that allows
                    // us to have this shortest distance.
                    const distViaMiddle =
                        dist[startIndex][middleIndex] +
                        dist[middleIndex][endIndex];

                    if (dist[startIndex][endIndex] > distViaMiddle) {
                        // We've found a shortest pass via middle vertex.
                        dist[startIndex][endIndex] = distViaMiddle;
                        next[startIndex][endIndex] = middleVertex.id;
                    }
                });
            });
        });
        return { dist, next };
    }

    public getPath(nodeA: Node, nodeB: Node) {
        // if (this.memoPath.get({n1:nodeA.id,n2:nodeB.id}])) {
        //     return this.memoPath[nodeA.id][nodeB.id]
        // }
        console.log({ nodeA, nodeB });

        if (!this.paths) return [];
        if (
            this.paths[nodeA.id][nodeB.id+1] === undefined ||
            this.paths[nodeA.id][nodeB.id+1] === Infinity
        ) {
            console.log('path is undefined or infinity');
            return [];
        }
        let path = [nodeA];
        let counter = 0
        let prevNode = nodeA.id
        while (nodeA.id != nodeB.id) {
            if (prevNode == nodeA.id && counter > 10) {
                console.log('preventing infiinite loop')
                return []
            }
            nodeA = this.getNodeById(this.paths[nodeA.id][nodeB.id+1]);
            path.push(nodeA);
            console.log('looking at ', nodeA);
            prevNode = nodeA.id
            counter++
        }
        return path;
    }
    public getPathById(nodeA: number, nodeB: number) {
        return this.getPath(this.getNodeById(nodeA), this.getNodeById(nodeB));
    }

    public getNodesInRange(
        node: Node,
        minDistance: number,
        maxDistance = Infinity
    ) {
        return this.weights[node.id]
            .map((weight, index) => {
                return { weight, index };
            })
            .filter(({ weight }) => {
                return weight > minDistance && weight < maxDistance;
            })
            .map(v => {
                return this.getNodeById(v.index);
            });
    }

    public dump() {
        console.log(
            JSON.stringify({ nodes: this.nodes, connections: this.edges })
        );
    }

    public updateEdgeWeight(nodeA: Node, nodeB: Node, newWeight: number) {
        if (newWeight < 1) {
            return;
        }
        this.edges.filter(edge => {
            if (
                (edge.source == nodeA && edge.dest == nodeB) ||
                (edge.source == nodeB && edge.dest == nodeA)
            ) {
                edge.weight = newWeight;
            }
        });
    }

    public loadFromJSON({ nodes, connections }) {
        this.nodes = nodes;
        this.edges = connections;
        const { dist: weights, next: paths } = this.floydWarshallAlgorithm();
        this.paths = paths;
        this.weights = weights;
        console.log(weights);
        console.log(paths);
        // console.log(this.getPath(nodes[0],nodes[12]))
    }
}
