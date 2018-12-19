const assert = require("assert");
const { parseInput, validateHeadInput } = require("../src/parser.js");

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

describe("validateHeadInput", function() {
  it("should return error message when -0 is given as option", function() {
    const input = ["-0", "head.js"];
    const expectedOutput = {
      message: "head: illegal line count -- 0",
      errorState: true
    };
    assert.deepEqual(validateHeadInput(input), expectedOutput);
  });
  it("should return a error message when option is other than n or c", function() {
    const input = ["-v", "5", "head.js"];
    const expectedOutput = {
      message: `head: illegal option -- v\nusage: head [-n lines | -c bytes] [file ...]`,
      errorState: true
    };
    assert.deepEqual(validateHeadInput(input), expectedOutput);
  });
  it("should return error message with first letter of the word given as wrong option", function() {
    const input = ["-hello", "5", "head.js"];
    const expectedOutput = {
      message: `head: illegal option -- h\nusage: head [-n lines | -c bytes] [file ...]`,
      errorState: true
    };
    assert.deepEqual(validateHeadInput(input), expectedOutput);
  });
  it("should return a error message when count is given as 0", function() {
    const input = ["-n0", "6", "head.js"];
    const expectedOutput = {
      message: "head: illegal line count -- 0",
      errorState: true
    };
    assert.deepEqual(validateHeadInput(input), expectedOutput);
  });
  it("should return a error message for alphanumeric option merged count", function() {
    const input = ["-n3av", "head.js"];
    const expectedOutput = {
      message: "head: illegal line count -- 3av",
      errorState: true
    };
    assert.deepEqual(validateHeadInput(input), expectedOutput);
  });
  it("should return a error message for alphanumeric count", function() {
    const input = ["-n", "3av", "head.js"];
    const expectedOutput = {
      message: "head: illegal line count -- 3av",
      errorState: true
    };
    assert.deepEqual(validateHeadInput(input), expectedOutput);
  });
});
