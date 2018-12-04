let readFile = require('fs').readFileSync;
let {parseInputs,getContents,getLines} = require('./src/lib.js');

const main = function(){
  let inputs = process.argv;
  let parsedInputs = parseInputs(inputs);
  let contents = getContents(parsedInputs,readFile);
  console.log(getLines(contents));
}

main();

/* 
  Usage:
  node ./head.js file1
  node ./head.js -n5 file1
  node ./head.js -n 5 file1
  node ./head.js -5 file1
  node ./head.js file1 file2
  node ./head.js -n 5 file1 file2
  node ./head.js -n5 file1 file2
  node ./head.js -5 file1 file2 
  node ./head.js -c5 file1
  node ./head.js -c 5 file1
  node ./head.js -c5 file1 file2
  node ./head.js -c 5 file1 file2
  */



