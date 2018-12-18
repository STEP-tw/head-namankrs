const assert = require("assert");
const { parseInput } = require("../src/parser.js");
describe("parseInput", function() {
  it("should return the default state when no option and count are provided", function() {
    const expectedOutput = {
      option: "-n",
      count: "10",
      files: ["../file"]
    };
    assert.deepEqual(parseInput(["../file"]), expectedOutput);
  });
  it("should change the default when -n option is given with count", function() {
    const input = ["-n", "13", "../file"];
    const expectedOutput = {
      option: "-n",
      count: "13",
      files: ["../file"]
    };
    assert.deepEqual(parseInput(input), expectedOutput);
  });
  it("should change the default when -c option is given with count", function() {
    const input = ["-c", "5", "../file1", "../file2"];
    const expectedOutput = {
      option: "-c",
      count: "5",
      files: ["../file1", "../file2"]
    };
    assert.deepEqual(parseInput(input), expectedOutput);
  });
  it("should change the default when option and count are not seperated by space", function() {
    const input = ["-c5", "../file1", "../file2"];
    let expectedOutput = {
      option: "-c",
      count: "5",
      files: ["../file1", "../file2"]
    };
    assert.deepEqual(parseInput(input), expectedOutput);
  });
  it("should take -n as default when only count is given", function() {
    const input = ["-5", "../file1", "../file2"];
    const expectedOutput = {
      option: "-n",
      count: "5",
      files: ["../file1", "../file2"]
    };
    assert.deepEqual(parseInput(input), expectedOutput);
  });
  it("should return the default count if no count is given", function() {
    const input = ["../file1", "../file2"];
    const expectedOutput = {
      option: "-n",
      count: "10",
      files: ["../file1", "../file2"]
    };
    assert.deepEqual(parseInput(input), expectedOutput);
  });
});
