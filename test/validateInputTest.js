const { validateInput } = require("../src/validateInput.js");
const assert = require("assert");

describe("validateInput", function() {
  it("should return error message when -0 is given as option", function() {
    let expectedOutput = {
      message: "head: illegal line count -- 0",
      errorState: true
    };
    assert.deepEqual(validateInput(["-0", "head.js"]), expectedOutput);
  });
  it("should return a error message when option is other than n or c", function() {
    let expectedOutput1 = {
      message: `head: illegal option -- v\nusage: head [-n lines | -c bytes] [file ...]`,
      errorState: true
    };
    let expectedOutput2 = {
      message: `head: illegal option -- h\nusage: head [-n lines | -c bytes] [file ...]`,
      errorState: true
    };
    assert.deepEqual(validateInput(["-v", "5", "head.js"]), expectedOutput1);
    assert.deepEqual(
      validateInput(["-hello", "5", "head.js"]),
      expectedOutput2
    );
  });
  it("should return a error message when count is given as 0", function() {
    let expectedOutput = {
      message: "head: illegal line count -- 0",
      errorState: true
    };
    assert.deepEqual(validateInput(["-n0", "6", "head.js"]), expectedOutput);
  });
  it("should return a error message for alphanumeric option merged count", function() {
    let expectedOutput = {
      message: "head: illegal line count -- 3av",
      errorState: true
    };
    assert.deepEqual(validateInput(["-n3av", "head.js"]), expectedOutput);
  });
  it("should return a error message for alphanumeric count", function() {
    let expectedOutput = {
      message: "head: illegal line count -- 3av",
      errorState: true
    };
    assert.deepEqual(validateInput(["-n", "3av", "head.js"]), expectedOutput);
  });
});
