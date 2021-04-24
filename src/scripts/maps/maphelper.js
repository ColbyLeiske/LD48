const data = require( './default.json')
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


const connections = data.connections
const nodes = busstopableNodes

// console.log(JSON.stringify({connections:n,nodes:data.nodes}))
fs.writeFileSync('./newmap.json',JSON.stringify({connections,nodes}))
