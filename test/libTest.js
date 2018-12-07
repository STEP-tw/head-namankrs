let { equal, deepEqual } = require("assert");
let {
  getCharacters,
  getLines,
  modifyContents,
  parseInputs,
  isInputInvalid,
  getContents,
  head
} = require("../src/lib.js");

describe("getCharacters", function() {
  it("should return an empty string when count is given as 0", function() {
    equal(getCharacters("naman", 0), "");
  });
  it("should return a set of characters when count greater than 0 is given", function() {
    equal(getCharacters("naman", 3), "nam");
  });
  it("should return the whole string if count greater than string length is given", function() {
    equal(getCharacters("naman", 10), "naman");
  });
});

describe("getLines", function() {
  let input = "there are\nfew fruits in \n the orchard.";
  it("should return an empty string when count is given as 0", function() {
    equal(getLines(input, 0), "");
  });
  it("should return the number of lines as specified by count", function() {
    let expectedOutput = "there are\nfew fruits in ";
    equal(getLines(input, 2), expectedOutput);
    equal(getLines(input, 1), "there are");
  });
  it("should return whole string if specified count is more than the number of lines in string", function() {
    let expectedOutput = "there are\nfew fruits in \n the orchard.";
    equal(getLines(input, 10), expectedOutput);
  });
});

describe("modifyContents", function() {
  it("should return the formatted content of a single file", function() {
    let readFileSync = x => x;
    let existsSync = x => true;
    let fs = { readFileSync, existsSync };
    let string = "hello world";
    let expectedOutput = "==> hello world <==\nhello world";
    equal(modifyContents(fs, getLines, 1, string), expectedOutput);
  });
  it("should return the error message if file does not exist", function() {
    let readFileSync = x => x;
    let existsSync = x => false;
    let fs = { readFileSync, existsSync };
    let string = "hello world";
    let expectedOutput = "head: hello world: No such file or directory";
    equal(modifyContents(fs, getLines, 1, string), expectedOutput);
  });
});

describe("getContents", function() {
  it("should return the formatted content of an array of files", function() {
    let readFileSync = x => x;
    let existsSync = x => true;
    let fs = { readFileSync, existsSync };
    let files = ["hello", "world"];
    let expectedOutput = "==> hello <==\nhello\n==> world <==\nworld";
    deepEqual(getContents(fs, getLines, 1, files), expectedOutput);
  });
});

describe("parseInputs", function() {
  it("should return the default state when no option and count are provided", function() {
    deepEqual(parseInputs(["head.js"]), {
      option: "-n",
      count: "10",
      files: ["head.js"]
    });
  });
  it("should change the default when some states are given", function() {
    deepEqual(parseInputs(["-n", "5", "hello", "world"]), {
      option: "-n",
      count: "5",
      files: ["hello", "world"]
    });
    deepEqual(parseInputs(["-c", "5", "hello", "world"]), {
      option: "-c",
      count: "5",
      files: ["hello", "world"]
    });
  });
  it("should work when option and count are not seperated by space", function() {
    deepEqual(parseInputs(["-c5", "hello", "world"]), {
      option: "-c",
      count: "5",
      files: ["hello", "world"]
    });
  });
  it("should take -n as default when only count is given", function() {
    deepEqual(parseInputs(["-5", "hello", "world"]), {
      option: "-n",
      count: "5",
      files: ["hello", "world"]
    });
  });
});

describe("isInputInvalid", function() {
  it("should return error message when -0 is given as option", function() {
    let expectedOutput = {
      message: "head: illegal line count -- 0",
      state: true
    };
    deepEqual(isInputInvalid(["-0", "head.js"]), expectedOutput);
  });
  it("should return a error message when option is other than n or c", function() {
    let expectedOutput1 = {
      message: `head: illegal option -- v\nusage: head [-n lines | -c bytes] [file ...]`,
      state: true
    };
    let expectedOutput2 = {
      message: `head: illegal option -- h\nusage: head [-n lines | -c bytes] [file ...]`,
      state: true
    };
    deepEqual(isInputInvalid(["-v", "5", "head.js"]), expectedOutput1);
    deepEqual(isInputInvalid(["-hello", "5", "head.js"]), expectedOutput2);
  });
  it("should return a error message when count is given as 0", function() {
    let expectedOutput = {
      message: "head: illegal line count -- 0",
      state: true
    };
    deepEqual(isInputInvalid(["-n0", "6", "head.js"]), expectedOutput);
  });
  it("should return a error message for alphanumeric count", function() {
    let expectedOutput = {
      message: "head: illegal line count -- 3av",
      state: true
    };
    deepEqual(isInputInvalid(["-n3av", "head.js"]), expectedOutput);
    deepEqual(isInputInvalid(["-n", "3av", "head.js"]), expectedOutput);
  });
});

describe("head", function() {
  let readFileSync = x => x;
  let existsSync = x => true;
  let fs = { readFileSync, existsSync };
  let file = "hello world";

  it("should return 1 lines of text when option is -n and count is 1", function() {
    let expectedOutput =
      "==> hello world <==\nhello world\n==> hello world <==\nhello world";
    deepEqual(head(fs, ["-n", "1", file]), file);
    deepEqual(head(fs, ["-n", "1", file, file]), expectedOutput);
  });
  it("should return an error message for single missing file", function() {
    let existsSync = (x) => false;
    let expectedOutput = "hello world";
    deepEqual(head(fs, ["-n", "1", file]), expectedOutput);
  });
  it("should return 5 characters of text when option is -c and count is 5", function() {
    deepEqual(head(fs, ["-c", "5", file]), "hello");
  });
  it("should return first 10 lines when no option is given", function() {
    deepEqual(head(fs, [file]), file);
  });
  it("should return error message when -0 is given as option", function() {
    let expectedOutput = "head: illegal line count -- 0";
    deepEqual(head(fs, ["-0", "head.js"]), expectedOutput);
  });
  it("should return a error message when option is other than n or c", function() {
    let expectedOutput1 = `head: illegal option -- v\nusage: head [-n lines | -c bytes] [file ...]`;
    let expectedOutput2 = `head: illegal option -- h\nusage: head [-n lines | -c bytes] [file ...]`;
    deepEqual(head(fs, ["-v", "5", "head.js"]), expectedOutput1);
    deepEqual(head(fs, ["-hello", "5", "head.js"]), expectedOutput2);
  });
  it("should return a error message when count is given as 0", function() {
    deepEqual(
      head(fs, ["-n0", "6", "head.js"]),
      "head: illegal line count -- 0"
    );
  });
  it("should return a error message for alphanumeric count", function() {
    let expectedOutput = "head: illegal line count -- 3av";
    deepEqual(head(fs, ["-n3av", "head.js"]), expectedOutput);
    deepEqual(head(fs, ["-n", "3av", "head.js"]), expectedOutput);
  });
});
