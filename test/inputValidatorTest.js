const { validateInput } = require("../src/parser.js");
const assert = require("assert");

describe("validateInput", function() {
  it("should return error message when -0 is given as option", function() {
    const input = ["-0", "head.js"];
    const expectedOutput = {
      message: "head: illegal line count -- 0",
      errorState: true
    };
    assert.deepEqual(validateInput(input), expectedOutput);
  });
  it("should return a error message when option is other than n or c", function() {
    const input = ["-v", "5", "head.js"];
    const expectedOutput = {
      message: `head: illegal option -- v\nusage: head [-n lines | -c bytes] [file ...]`,
      errorState: true
    };
    assert.deepEqual(validateInput(input), expectedOutput);
  });
  it("should return error message with first letter of the word given as wrong option", function() {
    const input = ["-hello", "5", "head.js"];
    const expectedOutput = {
      message: `head: illegal option -- h\nusage: head [-n lines | -c bytes] [file ...]`,
      errorState: true
    };
    assert.deepEqual(validateInput(input), expectedOutput);
  });
  it("should return a error message when count is given as 0", function() {
    const input = ["-n0", "6", "head.js"];
    const expectedOutput = {
      message: "head: illegal line count -- 0",
      errorState: true
    };
    assert.deepEqual(validateInput(input), expectedOutput);
  });
  it("should return a error message for alphanumeric option merged count", function() {
    const input = ["-n3av", "head.js"];
    const expectedOutput = {
      message: "head: illegal line count -- 3av",
      errorState: true
    };
    assert.deepEqual(validateInput(input), expectedOutput);
  });
  it("should return a error message for alphanumeric count", function() {
    const input = ["-n", "3av", "head.js"];
    const expectedOutput = {
      message: "head: illegal line count -- 3av",
      errorState: true
    };
    assert.deepEqual(validateInput(input), expectedOutput);
  });
});
