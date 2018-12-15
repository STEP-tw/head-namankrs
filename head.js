const fs = require("fs");
const { head } = require("./src/lib.js");

const main = function() {
  console.log(head(fs, process.argv.slice(2)));
};

main();