const data = require('./default.json')
const fs = require('fs')
//only store node ids and not all of the node
// const n = data.connections.map(({source,dest,weight}) => {
//     return {
//         source: source.id,
//         dest: dest.id,
//         weight
//     }
// })

//added a bus stop flag that was false, set it all to true
// const busstopableNodes = data.nodes.map((node) => {
//     node.canBeBusstop = true
//     return node
// })

const modifiedWeights = data.connections.map((edge) => {
    const { x: x1, y: y1 } = data.nodes[edge.source]
    const { x: x2, y: y2 } = data.nodes[edge.dest]
    const newWeight = Math.max(Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)), 1);
    console.log(newWeight)
    return {source:edge.source,dest:edge.dest,weight:newWeight}
})

const connections = modifiedWeights
const nodes = data.nodes

// console.log(JSON.stringify({connections:n,nodes:data.nodes}))
fs.writeFileSync('./newmap.json',JSON.stringify({connections,nodes}))
