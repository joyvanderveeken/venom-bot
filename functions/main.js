const { cb } = require('./pipeline.js')

//const pipeState = ret

const c = (v) => {
console.log(v);
}

console.log(cb(c));