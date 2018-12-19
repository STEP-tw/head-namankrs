const assert = require("assert");
const {
  getCharacters,
  getLines,
  head,
  filterContent,
  runCommand,
  tail
} = require("../src/fileUtil.js");

const mockReader = function(expectedFile, expectedContent) {
  return function(actualFile) {
    if (actualFile === expectedFile) {
      return expectedContent;
    }
  };
};

const mockValidator = function(expectedFile) {
  return function(actualFile) {
    return actualFile === expectedFile;
  };
};

describe("getCharacters", function() {
  it("should return an empty string when count is given as 0", function() {
    assert.equal(getCharacters("hello", 0), "");
  });
  it("should return a set of characters when count greater than 0 is given", function() {
    assert.equal(getCharacters("hello", 3), "hel");
  });
  it("should return the whole string if count greater than string length is given", function() {
    assert.equal(getCharacters("hello", 10), "hello");
  });
});

describe("getLines", function() {
  let input = "1\n2\n3\n4";
  it("should return an empty string when count is given as 0", function() {
    assert.equal(getLines(input, 0), "");
  });
  it("should return the whole file if count is exactly same as file length", function() {
    let expectedOutput = "1\n2";
    assert.equal(getLines(input, 2), expectedOutput);
  });
  it("should return the first line if count is 1", function() {
    assert.equal(getLines(input, 1), "1");
  });
  it("should return whole string if specified count is more than the number of lines in string", function() {
    let expectedOutput = "1\n2\n3\n4";
    assert.equal(getLines(input, 10), expectedOutput);
  });
});

describe("head", function() {
  let fileContents = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12";
  const readFileSync = mockReader("../file", fileContents);
  const existsSync = mockValidator("../file");
  let fs = { readFileSync, existsSync };
  it("should return 1 lines of text when option is -n and count is 1", function() {
    assert.deepEqual(head(["-n", "1", "../file"], fs), 1);
  });
  it("should return the contents seperated with header for two files", function() {
    let expectedOutput = "==> ../file <==\n1\n==> ../file <==\n1";
    assert.deepEqual(
      head(["-n", "1", "../file", "../file"], fs),
      expectedOutput
    );
  });
  it("should return 5 characters of text when option is -c and count is 5", function() {
    let expectedOutput = "1\n2\n3";
    assert.deepEqual(head(["-c", "5", "../file"], fs), expectedOutput);
  });
  it("should return first 10 lines when no option is given", function() {
    let expectedOutput = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10";
    assert.deepEqual(head(["../file"], fs), expectedOutput);
  });
  it("should return error message when -0 is given as option", function() {
    let expectedOutput = "head: illegal line count -- 0";
    assert.deepEqual(head(["-0", "../file"], fs), expectedOutput);
  });
  it("should return a error message when option is other than n or c", function() {
    let expectedOutput = `head: illegal option -- v\nusage: head [-n lines | -c bytes] [file ...]`;
    assert.deepEqual(head(["-v", "5", "../file"], fs), expectedOutput);
  });
  it("should return an error message with mentioning first alphabet if option is a word", function() {
    let expectedOutput = `head: illegal option -- h\nusage: head [-n lines | -c bytes] [file ...]`;
    assert.deepEqual(head(["-hello", "5", "../file"], fs), expectedOutput);
  });
  it("should return a error message when count is given as 0", function() {
    assert.deepEqual(
      head(["-n0", "6", "../file"], fs),
      "head: illegal line count -- 0"
    );
  });
  it("should return a error message for alphanumeric count", function() {
    let expectedOutput = "head: illegal line count -- 3av";
    assert.deepEqual(head(["-n3av", "../file"], fs), expectedOutput);
    assert.deepEqual(head(["-n", "3av", "../file"], fs), expectedOutput);
  });
  it("should return an error message for single missing file", function() {
    let expectedOutput = "head: ../file1: No such file or directory";
    assert.deepEqual(head(["-n", "1", "../file1"], fs), expectedOutput);
  });
});

describe("filterContent", function() {
  let fileContents = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12";
  const readFileSync = mockReader("../file", fileContents);
  const existsSync = mockValidator("../file");
  let fs = { readFileSync, existsSync };
  it("should return the last lines of the file by count after adding header", function() {
    let expectedOutput = "==> ../file <==\n11\n12";
    assert.deepEqual(
      filterContent(fs, getLines, 2, "tail", "../file"),
      expectedOutput
    );
  });
  it("should return the content of the file after adding header for tail command", function() {
    let expectedOutput = "==> ../file <==\n1\n12";
    assert.deepEqual(
      filterContent(fs, getCharacters, 4, "tail", "../file"),
      expectedOutput
    );
  });
  it("should return the entire content if count is greater than file length for tail command", function() {
    let expectedOutput =
      "==> ../file <==\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12";
    assert.deepEqual(
      filterContent(fs, getCharacters, 30, "tail", "../file"),
      expectedOutput
    );
  });
  it("should return an error message if file name is invalid for tail command", function() {
    let expectedOutput = "tail: ../file1: No such file or directory";
    assert.deepEqual(
      filterContent(fs, getLines, 2, "tail", "../file1"),
      expectedOutput
    );
  });

  it("should return the first lines of the file by count after adding header for head command", function() {
    let expectedOutput = "==> ../file <==\n1\n2";
    assert.deepEqual(
      filterContent(fs, getLines, 2, "head", "../file"),
      expectedOutput
    );
  });
  it("should return the content of the file after adding header for head command", function() {
    let expectedOutput = "==> ../file <==\n1\n2\n";
    assert.deepEqual(
      filterContent(fs, getCharacters, 4, "head", "../file"),
      expectedOutput
    );
  });
  it("should return the entire content if count is greater than file length for head command", function() {
    let expectedOutput =
      "==> ../file <==\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12";
    assert.deepEqual(
      filterContent(fs, getCharacters, 30, "head", "../file"),
      expectedOutput
    );
  });
  it("should return an error message if file name is invalid for head command", function() {
    let expectedOutput = "head: ../file1: No such file or directory";
    assert.deepEqual(
      filterContent(fs, getLines, 2, "head", "../file1"),
      expectedOutput
    );
  });
});

describe("runCommand", function() {
  let fileContents = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12";
  const readFileSync = mockReader("../file", fileContents);
  const existsSync = mockValidator("../file");
  const fs = { readFileSync, existsSync };
  const files = ["../file", "../file"];
  it("should return the formatted contents of all the given files with line count for tail command", function() {
    const expectedOutput = "==> ../file <==\n11\n12\n==> ../file <==\n11\n12";
    const input = {
      fs,
      fetchContents: getLines,
      count: 2,
      files,
      command: "tail"
    };
    assert.deepEqual(runCommand(input), expectedOutput);
  });
  it("should return the formatted contents of all the given files with character count for tail command", function() {
    let expectedOutput = "==> ../file <==\n\n12\n==> ../file <==\n\n12";
    const input = {
      fs,
      fetchContents: getCharacters,
      count: 3,
      files,
      command: "tail"
    };
    assert.deepEqual(runCommand(input), expectedOutput);
  });
  it("should return the formatted contents of all the given files with line count for head command", function() {
    const input = {
      fs,
      fetchContents: getLines,
      count: 2,
      files,
      command: "head"
    };
    const expectedOutput = "==> ../file <==\n1\n2\n==> ../file <==\n1\n2";
    assert.deepEqual(runCommand(input), expectedOutput);
  });
  it("should return the formatted contents of all the given files with character count for head command", function() {
    const input = {
      fs,
      fetchContents: getCharacters,
      count: 3,
      files,
      command: "head"
    };
    let expectedOutput = "==> ../file <==\n1\n2\n==> ../file <==\n1\n2";
    assert.deepEqual(runCommand(input), expectedOutput);
  });
});

describe("tail", function() {
  const fileContents = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12";
  const readFileSync = mockReader("../file", fileContents);
  const existsSync = mockValidator("../file");
  const fs = { readFileSync, existsSync };
  it("should return last two lines when option is n and count is 2 for one file", function() {
    let inputs = ["-n", "2", "../file"];
    let expectedOutput = "11\n12";
    assert.deepEqual(tail(inputs, fs), expectedOutput);
  });
  it("should return last two lines when option is n and count is 2 for more than one file", function() {
    let inputs = ["-n", "2", "../file", "../file"];
    let expectedOutput = "==> ../file <==\n11\n12\n==> ../file <==\n11\n12";
    assert.deepEqual(tail(inputs, fs), expectedOutput);
  });
  it("should return last two characters when option is c and count is 2 for one file", function() {
    let inputs = ["-c", "2", "../file"];
    let expectedOutput = "12";
    assert.deepEqual(tail(inputs, fs), expectedOutput);
  });
  it("should return last two characters when option is c and count is 2 for more than one file", function() {
    let inputs = ["-c", "2", "../file", "../file"];
    let expectedOutput = "==> ../file <==\n12\n==> ../file <==\n12";
    assert.deepEqual(tail(inputs, fs), expectedOutput);
  });
  it("should return last 2 lines when single file is given without option and count 2", function() {
    let inputs = ["2", "../file"];
    let expectedOutput = "11\n12";
    assert.deepEqual(tail(inputs, fs), expectedOutput);
  });
  it("should return an error message for a single missing file", function() {
    let inputs = ["-c", "2", "../file1"];
    let expectedOutput = "tail: ../file1: No such file or directory";
    assert.deepEqual(tail(inputs, fs), expectedOutput);
  });
  it("should return an error message for invalid count", function() {
    let inputs = ["-c", "2ac", "../file"];
    let expectedOutput = "tail: illegal offset -- 2ac";
    assert.deepEqual(tail(inputs, fs), expectedOutput);
  });
});
