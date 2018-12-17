const fs = require("fs");
const { head } = require("./src/lib.js");

const main = function() {
  console.log(head(process.argv.slice(2), fs));
};

main();
