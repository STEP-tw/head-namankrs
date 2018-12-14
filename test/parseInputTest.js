const { deepEqual } = require("assert");
const { parseInput } = require("../src/parseInput.js");
describe("parseInput", function() {
  it("should return the default state when no option and count are provided", function() {
    deepEqual(parseInput(["head.js"]), {
      option: "-n",
      count: "10",
      files: ["head.js"]
    });
  });
  it("should change the default when -n option is given", function() {
    deepEqual(parseInput(["-n", "5", "hello", "world"]), {
      option: "-n",
      count: "5",
      files: ["hello", "world"]
    });
  });
  it("should change the default when -c option is given", function() {
    deepEqual(parseInput(["-c", "5", "hello", "world"]), {
      option: "-c",
      count: "5",
      files: ["hello", "world"]
    });
  });
  it("should change the default when option and count are not seperated by space", function() {
    deepEqual(parseInput(["-c5", "hello", "world"]), {
      option: "-c",
      count: "5",
      files: ["hello", "world"]
    });
  });
  it("should take -n as default when only count is given", function() {
    deepEqual(parseInput(["-5", "hello", "world"]), {
      option: "-n",
      count: "5",
      files: ["hello", "world"]
    });
  });
  it("should return the default count if no count is given", function() {
    deepEqual(parseInput(["hello", "world"]), {
      option: "-n",
      count: "10",
      files: ["hello", "world"]
    });
  });
});
