const main = function() {
  const fs = require("fs");
  const { tail } = require("./src/lib.js");
  const inputs = process.argv;
  console.log(tail(fs, inputs.slice(2)));
};
main();