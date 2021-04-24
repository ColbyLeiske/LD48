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
            weight: weight || 1,
        });
        this.edges.push({
            dest: a.id,
            source: b.id,
            weight: weight || 1,
        });
    }

    public getConnections(node: Node) {
        return this.edges.filter(conn => {
            conn.source === node || conn.dest === node;
        });
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
        let dist = {};
        let next = {};

        for (let i = 0; i < this.nodes.length; i++) {
            dist[i] = [];
            next[i] = [];
        }

        for (let i = 0; i < this.nodes.length; i++) {
            // For existing edges assign the dist to be same as weight
            this.edges.forEach(e => {
                dist[e.source][e.dest] = e.weight;
                next[e.source][e.dest] = e.dest;
            });
            this.nodes.forEach(n => {
                // For all other nodes assign it to infinity
                if (dist[this.nodes[i].id][n.id] == undefined)
                    dist[this.nodes[i].id][n.id] = Infinity;
                // For self edge assign dist to be 0
                if (this.nodes[i].id === i) {
                    dist[i][i] = 0;
                    next[i][i] = i;
                }
            });
        }
        this.nodes.forEach(i => {
            this.nodes.forEach(j => {
                this.nodes.forEach(k => {
                    // Check if going from i to k then from k to j is better
                    // than directly going from i to j. If yes then update
                    // i to j value to the new value
                    if (
                        dist[i.id][k.id] + dist[k.id][j.id] <
                        dist[i.id][j.id]
                    ) {
                        dist[i.id][j.id] = dist[i.id][k.id] + dist[k.id][j.id];
                        next[i.id][j.id] = next[i.id][k.id];
                    }
                });
            });
        });
        return { dist, next };
    }

    public getPath(nodeA: Node, nodeB: Node) {
        if (!this.paths) return [];
        if (!this.paths[nodeA.id][nodeB.id]) return [];
        let path = [nodeA];
        while (nodeA != nodeB) {
            nodeA = this.getNodeById(this.paths[nodeA.id][nodeB.id]);
            path.push(nodeA);
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
        const ids = this.weights[node.id]
            .map((weight, index) => {
                return { weight, index };
            })
            .filter(({ weight }) => {
                return weight > minDistance && weight < maxDistance;
            })
            .map(v => {
                return v.index;
            });
        return ids.map(id => {
            // console.log(id)
            return this.getNodeById(id);
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
