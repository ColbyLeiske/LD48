/*! For license information please see main.f24d007a6b60f20a0340.bundle.js.LICENSE.txt */
(()=>{var e,s={678:(e,s,t)=>{"use strict";t(260);class i{constructor(e,s,t,i=!1,o=!1){this.x=e,this.y=s,this.id=t,this.canBeBusstop=i,this.isBusstop=o}}class o{constructor(){this.nodes=[],this.edges=[]}addNode(e){this.nodes.push(e)}addConnection(e,s,t){this.edges.push({source:e.id,dest:s.id,weight:t||1})}getConnections(e){return this.edges.filter((s=>{s.source===e||s.dest}))}getNode({x:e,y:s}){const t=this.nodes.filter((({x:t,y:i})=>Math.abs(e-t)<5&&Math.abs(s-i)<5));return t.length>=1?t[0]:new i(-1,-1,-1)}getNodeById(e){return this.nodes[e]}getNodesInRadius(e,s,t){return this.nodes.filter((({x:i,y:o})=>Math.abs(e-i)<t&&Math.abs(s-o)<t))}getSuitableRouteEnds(e){}floydWarshallAlgorithm(){let e={},s={};for(let t=0;t<this.nodes.length;t++)e[t]=[],s[t]={};for(let t=0;t<this.nodes.length;t++)this.edges.forEach((t=>{e[t.source][t.dest]=t.weight,e[t.dest][t.source]=t.weight,s[t.source][t.dest]=t.dest,s[t.dest][t.source]=t.source})),this.nodes.forEach((i=>{null==e[this.nodes[t].id][i.id]&&(e[this.nodes[t].id][i.id]=1/0),this.nodes[t].id===t&&(e[t][t]=0,s[t][t]=t)}));return this.nodes.forEach((t=>{this.nodes.forEach((i=>{this.nodes.forEach((o=>{e[t.id][o.id]+e[o.id][i.id]<e[t.id][i.id]&&(e[t.id][i.id]=e[t.id][o.id]+e[o.id][i.id],s[t.id][i.id]=s[t.id][o.id])}))}))})),{dist:e,next:s}}getPath(e,s){if(!this.paths)return[];if(!this.paths[e.id][s.id])return[];let t=[e];for(;e!=s;)e=this.getNodeById(this.paths[e.id][s.id]),t.push(e);return t}getPathById(e,s){return this.getPath(this.getNodeById(e),this.getNodeById(s))}getNodesFurtherThanDistance(e,s){return this.weights[e.id].filter((e=>e>s&&e!=1/0)).map(((e,s)=>s)).map((e=>this.getNodeById(e)))}dump(){console.log(JSON.stringify({nodes:this.nodes,connections:this.edges}))}loadFromJSON({nodes:e,connections:s}){this.nodes=e,this.edges=s;const{dist:t,next:i}=this.floydWarshallAlgorithm();this.paths=i,this.weights=t}}const d=JSON.parse('{"nodes":[{"x":168,"y":549,"id":0,"canBeBusstop":false},{"x":176,"y":446,"id":1,"canBeBusstop":false},{"x":228,"y":368,"id":2,"canBeBusstop":false},{"x":271,"y":338,"id":3,"canBeBusstop":false},{"x":348,"y":458,"id":4,"canBeBusstop":false},{"x":395,"y":585,"id":5,"canBeBusstop":false},{"x":276,"y":614,"id":6,"canBeBusstop":false},{"x":621,"y":543,"id":7,"canBeBusstop":false},{"x":615,"y":691,"id":8,"canBeBusstop":false},{"x":847,"y":564,"id":9,"canBeBusstop":false},{"x":985,"y":663,"id":10,"canBeBusstop":false},{"x":1010,"y":451,"id":11,"canBeBusstop":false},{"x":1104,"y":279,"id":12,"canBeBusstop":false},{"x":1102,"y":210,"id":13,"canBeBusstop":false},{"x":1126,"y":101,"id":14,"canBeBusstop":false},{"x":923,"y":85,"id":15,"canBeBusstop":false},{"x":996,"y":1,"id":16,"canBeBusstop":false},{"x":895,"y":119,"id":17,"canBeBusstop":false},{"x":744,"y":166,"id":18,"canBeBusstop":false},{"x":570,"y":192,"id":19,"canBeBusstop":false},{"x":647,"y":295,"id":20,"canBeBusstop":false},{"x":459,"y":232,"id":21,"canBeBusstop":false},{"x":359,"y":276,"id":22,"canBeBusstop":false},{"x":384,"y":181,"id":23,"canBeBusstop":false},{"x":245,"y":152,"id":24,"canBeBusstop":false},{"x":181,"y":236,"id":25,"canBeBusstop":false},{"x":502,"y":346,"id":26,"canBeBusstop":false},{"x":565,"y":354,"id":27,"canBeBusstop":false},{"x":654,"y":332,"id":28,"canBeBusstop":false},{"x":635,"y":304,"id":29,"canBeBusstop":true},{"x":621,"y":286,"id":30,"canBeBusstop":true},{"x":607,"y":267,"id":31,"canBeBusstop":true},{"x":590,"y":244,"id":32,"canBeBusstop":true},{"x":579,"y":229,"id":33,"canBeBusstop":true},{"x":565,"y":203,"id":34,"canBeBusstop":true},{"x":432,"y":258,"id":35,"canBeBusstop":true},{"x":455,"y":282,"id":36,"canBeBusstop":true},{"x":505,"y":335,"id":37,"canBeBusstop":true},{"x":528,"y":326,"id":38,"canBeBusstop":true},{"x":538,"y":345,"id":39,"canBeBusstop":true},{"x":565,"y":334,"id":40,"canBeBusstop":true},{"x":595,"y":321,"id":41,"canBeBusstop":true},{"x":402,"y":256,"id":42,"canBeBusstop":false},{"x":563,"y":234,"id":43,"canBeBusstop":true},{"x":540,"y":246,"id":44,"canBeBusstop":true},{"x":510,"y":259,"id":45,"canBeBusstop":true},{"x":480,"y":272,"id":46,"canBeBusstop":true},{"x":497,"y":290,"id":47,"canBeBusstop":true},{"x":528,"y":280,"id":48,"canBeBusstop":true},{"x":556,"y":265,"id":49,"canBeBusstop":true},{"x":578,"y":254,"id":50,"canBeBusstop":true},{"x":592,"y":273,"id":51,"canBeBusstop":true},{"x":569,"y":284,"id":52,"canBeBusstop":true},{"x":542,"y":296,"id":53,"canBeBusstop":true},{"x":514,"y":309,"id":54,"canBeBusstop":true},{"x":556,"y":313,"id":55,"canBeBusstop":true},{"x":583,"y":303,"id":56,"canBeBusstop":true},{"x":458,"y":247,"id":57,"canBeBusstop":true},{"x":493,"y":232,"id":58,"canBeBusstop":true},{"x":525,"y":220,"id":59,"canBeBusstop":true},{"x":548,"y":210,"id":60,"canBeBusstop":true},{"x":474,"y":302,"id":61,"canBeBusstop":true},{"x":489,"y":319,"id":62,"canBeBusstop":true},{"x":424,"y":279,"id":63,"canBeBusstop":false},{"x":453,"y":302,"id":64,"canBeBusstop":false},{"x":573,"y":346,"id":65,"canBeBusstop":true},{"x":616,"y":334,"id":66,"canBeBusstop":true},{"x":593,"y":203,"id":67,"canBeBusstop":true,"isBusstop":false},{"x":613,"y":195,"id":68,"canBeBusstop":true,"isBusstop":false},{"x":633,"y":188,"id":69,"canBeBusstop":true,"isBusstop":false},{"x":637,"y":196,"id":70,"canBeBusstop":true,"isBusstop":false},{"x":670,"y":187,"id":71,"canBeBusstop":true,"isBusstop":false},{"x":697,"y":181,"id":72,"canBeBusstop":true,"isBusstop":false},{"x":710,"y":201,"id":73,"canBeBusstop":true,"isBusstop":false},{"x":703,"y":203,"id":74,"canBeBusstop":true,"isBusstop":false},{"x":707,"y":227,"id":75,"canBeBusstop":true,"isBusstop":false},{"x":713,"y":242,"id":76,"canBeBusstop":true,"isBusstop":false},{"x":696,"y":279,"id":77,"canBeBusstop":true,"isBusstop":false},{"x":674,"y":262,"id":78,"canBeBusstop":true,"isBusstop":false},{"x":653,"y":278,"id":79,"canBeBusstop":true,"isBusstop":false},{"x":699,"y":251,"id":80,"canBeBusstop":true,"isBusstop":false},{"x":691,"y":237,"id":81,"canBeBusstop":true,"isBusstop":false},{"x":665,"y":245,"id":82,"canBeBusstop":true,"isBusstop":false},{"x":642,"y":261,"id":83,"canBeBusstop":true,"isBusstop":false},{"x":630,"y":243,"id":84,"canBeBusstop":true,"isBusstop":false},{"x":621,"y":232,"id":85,"canBeBusstop":true,"isBusstop":false},{"x":638,"y":226,"id":86,"canBeBusstop":true,"isBusstop":false},{"x":653,"y":220,"id":87,"canBeBusstop":true,"isBusstop":false},{"x":679,"y":212,"id":88,"canBeBusstop":true,"isBusstop":false},{"x":623,"y":212,"id":89,"canBeBusstop":true,"isBusstop":false},{"x":641,"y":203,"id":90,"canBeBusstop":true,"isBusstop":false},{"x":603,"y":220,"id":91,"canBeBusstop":true,"isBusstop":false},{"x":612,"y":235,"id":92,"canBeBusstop":true,"isBusstop":false},{"x":757,"y":179,"id":93,"canBeBusstop":true,"isBusstop":false},{"x":661,"y":288,"id":94,"canBeBusstop":true,"isBusstop":false},{"x":684,"y":282,"id":95,"canBeBusstop":true,"isBusstop":false},{"x":705,"y":259,"id":96,"canBeBusstop":true,"isBusstop":false}],"connections":[{"source":25,"dest":24,"weight":1},{"source":24,"dest":23,"weight":1},{"source":23,"dest":21,"weight":1},{"source":21,"dest":19,"weight":1},{"source":19,"dest":18,"weight":1},{"source":18,"dest":17,"weight":1},{"source":17,"dest":15,"weight":1},{"source":15,"dest":16,"weight":1},{"source":15,"dest":13,"weight":1},{"source":13,"dest":14,"weight":1},{"source":13,"dest":12,"weight":1},{"source":12,"dest":11,"weight":1},{"source":11,"dest":9,"weight":1},{"source":9,"dest":10,"weight":1},{"source":7,"dest":9,"weight":1},{"source":8,"dest":7,"weight":1},{"source":7,"dest":5,"weight":1},{"source":5,"dest":6,"weight":1},{"source":0,"dest":1,"weight":1},{"source":1,"dest":2,"weight":1},{"source":2,"dest":3,"weight":1},{"source":3,"dest":4,"weight":1},{"source":4,"dest":5,"weight":1},{"source":3,"dest":22,"weight":1},{"source":22,"dest":21,"weight":1},{"source":19,"dest":20,"weight":1},{"source":26,"dest":27,"weight":1},{"source":27,"dest":28,"weight":1},{"source":28,"dest":29,"weight":1},{"source":29,"dest":20,"weight":1},{"source":29,"dest":30,"weight":1},{"source":30,"dest":31,"weight":1},{"source":31,"dest":32,"weight":1},{"source":32,"dest":33,"weight":1},{"source":33,"dest":34,"weight":1},{"source":35,"dest":36,"weight":1},{"source":36,"dest":37,"weight":1},{"source":37,"dest":38,"weight":1},{"source":38,"dest":39,"weight":1},{"source":39,"dest":40,"weight":1},{"source":40,"dest":41,"weight":1},{"source":41,"dest":29,"weight":1},{"source":41,"dest":56,"weight":1},{"source":52,"dest":56,"weight":1},{"source":52,"dest":49,"weight":1},{"source":49,"dest":44,"weight":1},{"source":44,"dest":45,"weight":1},{"source":45,"dest":46,"weight":1},{"source":46,"dest":36,"weight":1},{"source":46,"dest":47,"weight":1},{"source":47,"dest":54,"weight":1},{"source":54,"dest":38,"weight":1},{"source":45,"dest":48,"weight":1},{"source":48,"dest":53,"weight":1},{"source":53,"dest":55,"weight":1},{"source":38,"dest":55,"weight":1},{"source":55,"dest":56,"weight":1},{"source":44,"dest":43,"weight":1},{"source":43,"dest":33,"weight":1},{"source":32,"dest":50,"weight":1},{"source":50,"dest":49,"weight":1},{"source":51,"dest":52,"weight":1},{"source":31,"dest":51,"weight":1},{"source":51,"dest":30,"weight":1},{"source":30,"dest":56,"weight":1},{"source":34,"dest":60,"weight":1},{"source":60,"dest":59,"weight":1},{"source":59,"dest":58,"weight":1},{"source":58,"dest":57,"weight":1},{"source":57,"dest":35,"weight":1},{"source":57,"dest":46,"weight":1},{"source":58,"dest":45,"weight":1},{"source":59,"dest":44,"weight":1},{"source":60,"dest":43,"weight":1},{"source":43,"dest":50,"weight":1},{"source":50,"dest":51,"weight":1},{"source":61,"dest":47,"weight":1},{"source":47,"dest":48,"weight":1},{"source":48,"dest":49,"weight":1},{"source":52,"dest":53,"weight":1},{"source":53,"dest":54,"weight":1},{"source":54,"dest":62,"weight":1},{"source":64,"dest":36,"weight":1},{"source":63,"dest":36,"weight":1},{"source":63,"dest":64,"weight":1},{"source":42,"dest":63,"weight":1},{"source":64,"dest":26,"weight":1},{"source":41,"dest":66,"weight":1},{"source":66,"dest":28,"weight":1},{"source":55,"dest":40,"weight":1},{"source":40,"dest":65,"weight":1},{"source":65,"dest":66,"weight":1},{"source":20,"dest":94,"weight":1},{"source":94,"dest":79,"weight":1},{"source":94,"dest":95,"weight":1},{"source":95,"dest":77,"weight":1},{"source":77,"dest":96,"weight":1},{"source":96,"dest":80,"weight":1},{"source":80,"dest":81,"weight":1},{"source":81,"dest":88,"weight":1},{"source":88,"dest":71,"weight":1},{"source":71,"dest":70,"weight":1},{"source":70,"dest":90,"weight":1},{"source":90,"dest":89,"weight":1},{"source":89,"dest":91,"weight":1},{"source":91,"dest":92,"weight":1},{"source":92,"dest":85,"weight":1},{"source":85,"dest":84,"weight":1},{"source":84,"dest":83,"weight":1},{"source":83,"dest":79,"weight":1},{"source":79,"dest":78,"weight":1},{"source":78,"dest":80,"weight":1},{"source":83,"dest":82,"weight":1},{"source":82,"dest":81,"weight":1},{"source":81,"dest":75,"weight":1},{"source":75,"dest":74,"weight":1},{"source":74,"dest":88,"weight":1},{"source":88,"dest":87,"weight":1},{"source":87,"dest":86,"weight":1},{"source":86,"dest":84,"weight":1},{"source":86,"dest":85,"weight":1},{"source":89,"dest":86,"weight":1},{"source":68,"dest":89,"weight":1},{"source":67,"dest":91,"weight":1},{"source":67,"dest":68,"weight":1},{"source":68,"dest":69,"weight":1},{"source":71,"dest":72,"weight":1},{"source":72,"dest":73,"weight":1},{"source":73,"dest":74,"weight":1},{"source":73,"dest":93,"weight":1},{"source":75,"dest":76,"weight":1},{"source":76,"dest":96,"weight":1},{"source":95,"dest":78,"weight":1},{"source":78,"dest":82,"weight":1},{"source":82,"dest":87,"weight":1},{"source":87,"dest":90,"weight":1},{"source":70,"dest":69,"weight":1}]}');class u extends Phaser.GameObjects.Text{constructor(e){super(e,1100,20,"",{color:"black",fontSize:"28px"}),e.add.existing(this),this.setOrigin(0)}update(e){this.setText(`Cash: ${Math.floor(100*e)}`)}}class r extends Phaser.GameObjects.Sprite{constructor(e,s,t,i){super(e,s,t,"pin"),this.setTintFill(i),e.add.existing(this)}update(){}}var a=t(486),c=t.n(a);class n extends Phaser.Scene{constructor(){super({key:"GameScene"}),this.addingNewRoute=!1,this.routes=[],this.colors=[2007906,16769095,4884979,16771993,5268615,5753542,12376686,15954287,13848409]}create(){this.add.sprite(0,0,"map").setOrigin(0),this.moneyText=new u(this),this.grid=new o,this.grid.loadFromJSON(d),this.potentialStopMarkers=this.add.group(),this.grid.nodes.filter((e=>e.canBeBusstop)).forEach((e=>{const s=this.add.sprite(e.x+2,e.y-10,"stopPin").setInteractive().setDataEnabled().setData("nodeid",e.id);s.on("pointerdown",(t=>{if(this.potentialFirstStop===s)return this.potentialFirstStop=void 0,s.clearTint(),void this.potentialStopMarkers.setVisible(!0).setActive(!0);if(this.potentialFirstStop){this.potentialFirstStop.setData("isBusStop",!0),s.setData("isBusStop",!0),this.potentialStopMarkers.remove(s,!0),this.potentialStopMarkers.remove(this.potentialFirstStop,!0);const e=c().sample(this.colors),t=new r(this,this.potentialFirstStop.x,this.potentialFirstStop.y-2,e),i=new r(this,s.x,s.y-2,e),o=this.grid.getPathById(this.potentialFirstStop.getData("nodeid"),s.getData("nodeid")).map((e=>[e.x,e.y]));console.log(o);let d=[];for(let s=1;s<o.length;s++){const[t,i]=o[s-1],[u,r]=o[s];d.push(this.addLine(t,i,u,r,e))}return this.routes.push({stopA:this.potentialFirstStop,stopB:s,pinA:t,pinB:i,routeLines:d}),void this.toggleNewRoute()}this.potentialFirstStop=s,s.setTint(11184640),s.tintFill=!0;const i=this.grid.getNodesFurtherThanDistance(e,5).map((e=>e.id));this.potentialStopMarkers.getChildren().filter((e=>{var s;const t=e.getData("nodeid");return!i.includes(t)&&t!=(null===(s=this.potentialFirstStop)||void 0===s?void 0:s.getData("nodeid"))})).forEach((e=>{e.setActive(!1),e.setVisible(!1)}))})),this.potentialStopMarkers.add(s)})),this.potentialStopMarkers.setVisible(!1).setActive(!1),this.modeText=this.add.text(400,10,"Adding Route").setVisible(!1),this.add.rectangle(256,10,48,22,65280).setInteractive().on("pointerdown",(e=>{this.toggleNewRoute()})),this.input.keyboard.addKey("ESC").on("down",(e=>{this.addingNewRoute&&this.toggleNewRoute()}))}toggleNewRoute(){this.addingNewRoute=!this.addingNewRoute,this.modeText.setVisible(this.addingNewRoute),this.potentialStopMarkers.setVisible(this.addingNewRoute).setActive(this.addingNewRoute),this.potentialFirstStop=void 0,this.potentialStopMarkers.setTint(16777215)}addLine(e,s,t,i,o){return this.add.line(e,s,0,0,-1*(e-t),-1*(s-i),o).setOrigin(0)}update(){this.moneyText.update(this.money)}}class h extends Phaser.Scene{constructor(){super({key:"PreloadScene"})}preload(){this.load.image("map","assets/maps/startermap.png"),this.load.image("stopPin","assets/misc/pin.png"),this.load.image("pin","assets/misc/pinclear.png"),this.load.image("busIcon","assets/misc/bus.png")}create(){this.scene.start("GameScene")}}const p={type:Phaser.AUTO,backgroundColor:"#ffffff",scale:{parent:"phaser-game",mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:1280,height:720},scene:[h,n]};window.addEventListener("load",(()=>{new Phaser.Game(p)}))},204:()=>{console.log("%c %c %c %c %c Built using phaser-project-template %c https://github.com/yandeu/phaser-project-template","background: #ff0000","background: #ffff00","background: #00ff00","background: #00ffff","color: #fff; background: #000000;","background: none")}},t={};function i(e){var o=t[e];if(void 0!==o)return o.exports;var d=t[e]={id:e,loaded:!1,exports:{}};return s[e].call(d.exports,d,d.exports,i),d.loaded=!0,d.exports}i.m=s,e=[],i.O=(s,t,o,d)=>{if(!t){var u=1/0;for(c=0;c<e.length;c++){for(var[t,o,d]=e[c],r=!0,a=0;a<t.length;a++)(!1&d||u>=d)&&Object.keys(i.O).every((e=>i.O[e](t[a])))?t.splice(a--,1):(r=!1,d<u&&(u=d));r&&(e.splice(c--,1),s=o())}return s}d=d||0;for(var c=e.length;c>0&&e[c-1][2]>d;c--)e[c]=e[c-1];e[c]=[t,o,d]},i.n=e=>{var s=e&&e.__esModule?()=>e.default:()=>e;return i.d(s,{a:s}),s},i.d=(e,s)=>{for(var t in s)i.o(s,t)&&!i.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:s[t]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.o=(e,s)=>Object.prototype.hasOwnProperty.call(e,s),i.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var e={179:0};i.O.j=s=>0===e[s];var s=(s,t)=>{var o,d,[u,r,a]=t,c=0;for(o in r)i.o(r,o)&&(i.m[o]=r[o]);if(a)var n=a(i);for(s&&s(t);c<u.length;c++)d=u[c],i.o(e,d)&&e[d]&&e[d][0](),e[u[c]]=0;return i.O(n)},t=self.webpackChunkld48=self.webpackChunkld48||[];t.forEach(s.bind(null,0)),t.push=s.bind(null,t.push.bind(t))})(),i.O(void 0,[216],(()=>i(678)));var o=i.O(void 0,[216],(()=>i(204)));o=i.O(o)})();