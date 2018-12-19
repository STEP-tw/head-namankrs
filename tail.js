const fs = require("fs");
const { tail } = require("./src/fileUtil.js");

const main = function() {
  const inputs = process.argv;
  console.log(tail(inputs.slice(2), fs));
};

main();
