const { equal, deepEqual } = require("assert");
const {
  getCharacters,
  getLines,
  modifyContents,
  validateInput,
  getContents,
  head,
  formatContents,
  formatAllContents,
  tail
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
  it("should return the whole file if count is exactly same as file length", function() {
    let expectedOutput = "there are\nfew fruits in ";
    equal(getLines(input, 2), expectedOutput);
  });
  it("should return the first line if count is 1", function() {
    equal(getLines(input, 1), "there are");
  });
  it("should return whole string if specified count is more than the number of lines in string", function() {
    let expectedOutput = "there are\nfew fruits in \n the orchard.";
    equal(getLines(input, 10), expectedOutput);
  });
});

describe("modifyContents", function() {
  let readFileSync = x => x;
  let existsSync = x => true;
  let fs = { readFileSync, existsSync };
  let string = "hello world";
  it("should return the formatted content of a single file", function() {
    let expectedOutput = "==> hello world <==\nhello world";
    equal(modifyContents(fs, getLines, 1, string), expectedOutput);
  });

  it("should return the whole file if count is more than the file length", function() {
    let expectedOutput = "==> hello world <==\nhello world";
    equal(modifyContents(fs, getLines, 2, string), expectedOutput);
  });
  it("should return the error message if file does not exist", function() {
    existsSync = x => false;
    fs = { readFileSync, existsSync };
    let expectedOutput = "head: hello world: No such file or directory";
    equal(modifyContents(fs, getLines, 1, string), expectedOutput);
  });
});

describe("getContents", function() {
  let readFileSync = x => x;
  let existsSync = x => true;
  let fs = { readFileSync, existsSync };
  let files = ["hello", "world"];
  it("should return the formatted content of an array of files", function() {
    let expectedOutput = "==> hello <==\nhello\n==> world <==\nworld";
    deepEqual(getContents(fs, getLines, 1, files), expectedOutput);
  });
  it("should return an error message for single missing file", function() {
    let existsSync = x => false;
    let fs = { readFileSync, existsSync };
    let expectedOutput = "head: hello: No such file or directory";
    deepEqual(getContents(fs, getLines, 1, ["hello"]), expectedOutput);
  });
  it("should return an error message for more than one missing file", function() {
    let existsSync = x => false;
    let fs = { readFileSync, existsSync };
    let expectedOutput =
      "head: hello: No such file or directory\nhead: world: No such file or directory";
    deepEqual(getContents(fs, getLines, 1, files), expectedOutput);
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
    let expectedOutput = `head: illegal option -- v\nusage: head [-n lines | -c bytes] [file ...]`;
    deepEqual(head(fs, ["-v", "5", "head.js"]), expectedOutput);
  });
  it("should return an error message with mentioning first alphabet if option is a word", function() {
    let expectedOutput = `head: illegal option -- h\nusage: head [-n lines | -c bytes] [file ...]`;
    deepEqual(head(fs, ["-hello", "5", "head.js"]), expectedOutput);
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
  it("should return an error message for single missing file", function() {
    let existsSync = x => false;
    let fs = { readFileSync, existsSync };
    let expectedOutput = "head: hello world: No such file or directory";
    deepEqual(head(fs, ["-n", "1", file]), expectedOutput);
  });
});

describe("formatContents", function() {
  let readFileSync = x => x;
  let existsSync = x => true;
  let fs = { readFileSync, existsSync };
  let file = "1\n2\n3\n4\n";
  it("should return the content of the file after adding header", function() {
    let expectedOutput = "==> 1\n2\n3\n4\n <==\n3\n4";
    deepEqual(formatContents(fs, getLines, 2, file), expectedOutput);
  });
  it("should return the content of the file after adding header", function() {
    let expectedOutput = "==> 1\n2\n3\n4\n <==\n\n3\n4";
    deepEqual(formatContents(fs, getCharacters, 4, file), expectedOutput);
  });
  it("should return the entire content if count is greater than file length", function() {
    let expectedOutput = "==> 1\n2\n3\n4\n <==\n1\n2\n3\n4";
    deepEqual(formatContents(fs, getCharacters, 10, file), expectedOutput);
  });
  it("should return an error message if file name is invalid", function() {
    let existsSync = x => false;
    let fs = { readFileSync, existsSync };
    let file = "hello";
    let expectedOutput = "tail: hello: No such file or directory";
    deepEqual(formatContents(fs, getLines, 2, file), expectedOutput);
  });
});

describe("formatAllContents", function() {
  let readFileSync = x => x;
  let existsSync = x => true;
  let fs = { readFileSync, existsSync };
  let file1 = "1\n2\n3\n4";
  let file2 = "5\n6\n7";
  let files = [file1, file2];
  let expectedOutput = "==> 1\n2\n3\n4 <==\n3\n4\n==> 5\n6\n7 <==\n6\n7";
  it("should return the formatted contents of all the given files", function() {
    deepEqual(formatAllContents(fs, getLines, 2, files), expectedOutput);
  });
  it("should return the formatted contents of all the given files", function() {
    let expectedOutput = "==> 1\n2\n3\n4 <==\n3\n4\n==> 5\n6\n7 <==\n6\n7";
    deepEqual(formatAllContents(fs, getCharacters, 3, files), expectedOutput);
  });
});

describe("tail", function() {
  let readFileSync = x => x;
  let existsSync = x => true;
  let fs = { readFileSync, existsSync };
  it("should return last two lines when option is n and count is 2 for more than one file", function() {
    let file = "1\n2";
    let inputs = ["-n", "2", file, file];
    let expectedOutput = "==> 1\n2 <==\n1\n2\n==> 1\n2 <==\n1\n2";
    deepEqual(tail(fs, inputs), expectedOutput);
  });
  it("should return last two characters when option is c and count is 2 for more than one file", function() {
    let file = "1\n2";
    let inputs = ["-c", "2", file, file];
    let expectedOutput = "==> 1\n2 <==\n\n2\n==> 1\n2 <==\n\n2";
    deepEqual(tail(fs, inputs), expectedOutput);
  });
  it("should return contents when single file is given", function() {
    let file = "hello";
    let inputs = ["-c", "2", file];
    let expectedOutput = "lo";
    deepEqual(tail(fs, inputs), expectedOutput);
  });
  it("should return an error message for a single missing file", function() {
    let file = "hello";
    let inputs = ["-c", "2", file];
    let existsSync = x => false;
    let fs = { readFileSync, existsSync };
    let expectedOutput = "tail: hello: No such file or directory";
    deepEqual(tail(fs, inputs), expectedOutput);
  });
  it("should return an error message for invalid count", function() {
    let file = "hello";
    let inputs = ["-c", "2ac", file];
    let existsSync = x => true;
    let fs = { readFileSync, existsSync };
    let expectedOutput = "tail: illegal offset -- 2ac";
    deepEqual(tail(fs, inputs), expectedOutput);
  });
});
