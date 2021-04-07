const { spawn } = require('child_process');
const fs = require('fs');

const parseState = (p) => {
  // console.log(p);
  const a = p.split(',');
  const name = a[1].replace(':', '');

  // console.log(a[0], n);

  // const s = p.stageStates;
  // let r = ''
  // const a = s.map((t) => {
  //   if (t.actionStates[0].revisionUrl) {
  //     r = t.actionStates[0].revisionUrl
  //   }
  //   return {
  //     name: t.actionStates[0].actionName,
  //     status: t.actionStates[0].latestExecution.status
  //   }

  // })
  // const sp = r.split('/'); 
  ret({
    commit: a[0],
    name
  })
}

const pipeState = () => {
  fs.readFile("gitlogged", (e, d) => {
    return parseState(d.toString())
  })
};

const child = spawn(
  './gitlog.sh',
  { stdio: [process.stdin, process.stdout, process.stderr] }
);

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

