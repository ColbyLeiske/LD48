import Node from './node'

export default class Grid {
  nodes: Node[] = []
  connections: any[] = []

  public addNode(node: Node) {
    this.nodes.push(node)
  }

  public addConnection(a: Node, b: Node, weight?: number) {
    // set both ways for bidirectional graph
    this.connections.push({ source: a.id, dest: b.id, weight: weight || 1 })
  }

  public getConnections(node: Node) {
    return this.connections.filter(conn => {
      conn.source === node || conn.dest === node
    })
  }

  public getNode({ x: dx, y: dy }) {
    const tempRadius = 5
    const potentialNodes = this.nodes.filter(({ x, y }) => {
      return Math.abs(dx - x) < tempRadius && Math.abs(dy - y) < tempRadius
    })
    if (potentialNodes.length === 1) return potentialNodes[0]

    return new Node(-1, -1, -1)
  }

  public getNodeById(id: number){
      return this.nodes[id]
  }

  public dump() {
    console.log(JSON.stringify({ nodes: this.nodes, connections: this.connections }))
  }

  public loadFromJSON({ nodes, connections }) {
    this.nodes = nodes
    this.connections = connections
  }
}
