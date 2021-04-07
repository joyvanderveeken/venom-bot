const { spawn } = require('child_process');
const fs = require('fs');

const parseState = (p) => {
  const s = p.stageStates;
  let r = ''
  const a = s.map((t) => {
    if (t.actionStates[0].revisionUrl) {
      r = t.actionStates[0].revisionUrl
    }
    return {
      name: t.actionStates[0].actionName,
      status: t.actionStates[0].latestExecution.status
    }

  })
  const sp = r.split('/'); 
  ret({
    commit: sp[sp.length - 1],
    stages: a
  })
}

const pipeState = () => {
  fs.readFile("pipestate.json", (e, d) => {
    return parseState(JSON.parse(d), ret)
  })
};

const child = spawn(
  './pipe.sh',
  { stdio: [process.stdin, process.stdout, process.stderr] }
)

  let val = {}
  const ret = (obj) => {
    val = obj;
    console.log(obj);
  }

child.on('close', pipeState);
  
const cb = async (c) => {
  await c(val);
}
  
exports.cb = cb

