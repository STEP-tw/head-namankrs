const {parseInput} = require('./parseInput.js');
const getCharacters = function(string, endCount, initCount = 0) {
  return string.slice(initCount, endCount);
};

const getLines = function(string, endCount, initCount = 0) {
  let lines = string.split("\n");
  return lines.slice(initCount, endCount).join("\n");
};

const modifyContents = function(fs, mapper, count, file) {
  let modifiedContents = `head: ${file}: No such file or directory`;
  if (fs.existsSync(file)) {
    let contents = fs.readFileSync(file, "utf8");
    modifiedContents = mapper(contents, count);
    modifiedContents = `==> ${file} <==\n${modifiedContents}`;
  }
  return modifiedContents;
};

const getContents = function(fs, mapper, count, files) {
  let callback = modifyContents.bind(null, fs, mapper, count);
  return files.map(callback).join("\n");
};

const isCountValid = x => !isNaN(x);

const isCountInvalid = x => x == "-0";

const lacksOption = x => !x.includes("-c") && !x.includes("-n");

const isAlphanumeric = x => isNaN(x) && x[0] == "-";

const isOptionInvalid = x => lacksOption(x) && isAlphanumeric(x);

const isAlphabetOrZero = x => isNaN(x.slice(2)) || x.slice(2) == "0";

const isValidOption = x => x.slice(0, 2) == "-n" || x.slice(0, 2) == "-c";

const isCountZero = x => isAlphabetOrZero(x) && isValidOption(x);

const hasOption = x => x == "-n" || x == "-c";

const hasInvalidCount = x => x < 1 || isNaN(x);

const isCountAlphanumeric = (x, y) => hasOption(x) && hasInvalidCount(y);

const invalidCountError = function() {
  return { message: "head: illegal line count -- 0", errorState: true };
};

const invalidOptionError = function(input) {
  return {
    message: `head: illegal option -- ${input[1]}
usage: head [-n lines | -c bytes] [file ...]`,
    errorState: true
  };
};

const countZeroError = function(input) {
  let option = { "-n": "line", "-c": "byte" };
  return {
    message: `head: illegal ${option[input.slice(0, 2)]} count -- ${input.slice(
      2
    )}`,
    errorState: true
  };
};

const alphanumericCountError = function(option, count) {
  let types = { "-n": "line", "-c": "byte" };
  return {
    message: `head: illegal ${types[option]} count -- ${count}`,
    errorState: true
  };
};

const validateInput = function(input) {
  let errorState = false;
  let message = "";

  if (isCountInvalid(input[0])) {
    return invalidCountError();
  }

  if (isOptionInvalid(input[0])) {
    return invalidOptionError(input[0]);
  }

  if (isCountZero(input[0])) {
    return countZeroError(input[0]);
  }

  if (isCountAlphanumeric(input[0], input[1])) {
    return alphanumericCountError(input[0], input[1]);
  }
  return { errorState, message };
};

const getDetails = function(inputs) {
  let { option, count, files } = parseInput(inputs);
  let func = { "-c": getCharacters, "-n": getLines };
  let mapper = func[option];
  return { files, count, mapper };
};

const removeHeader = function(contents) {
  trimmedContents = contents.split("\n");
  trimmedContents.shift();
  return trimmedContents.join("\n");
};

const head = function(fs, inputs) {
  let { errorState, message } = validateInput(inputs);
  if (errorState) return message;

  let { files, count, mapper } = getDetails(inputs);
  let contents = getContents(fs, mapper, count, files);

  if (files.length > 1) return contents;

  if (fs.existsSync(files[0])) {
    contents = removeHeader(contents);
  }
  return contents;
};

const trimEnd = function(contents) {
  contents = contents.split("\n");
  contents.pop();
  return contents.join("\n");
};

const getCounts = function(contents,mapper,count) {
  let endCount = contents.length;
  let initCount = endCount - count;
  if (mapper == getLines) {
    endCount = contents.split("\n").length;
    initCount = endCount - count;
  }
  if (count > endCount) initCount = 0;
  return {endCount,initCount};
};

const formatContents = function(fs, mapper, count, file) {
  let formattedContents = `tail: ${file}: No such file or directory`;
  if (fs.existsSync(file)) {
    let contents = fs.readFileSync(file, "utf8");
    if (contents.endsWith("\n")) {
      contents = trimEnd(contents);
    }
    let {endCount,initCount} = getCounts(contents,mapper,count);
    if (count > endCount) initCount = 0;
    formattedContents = mapper(contents, endCount, initCount);
    formattedContents = `==> ${file} <==\n${formattedContents}`;
  }
  return formattedContents;
};

const formatAllContents = function(fs, mapper, count, files) {
  let callback = formatContents.bind(null, fs, mapper, count);
  return files.map(callback).join("\n");
};

const tail = function(fs, inputs) {
  let { files, count, mapper } = getDetails(inputs);
  let finalContents = formatAllContents(fs, mapper, count, files);

  if (!isCountValid(count)) {
    return `tail: illegal offset -- ${count}`;
  }
  if (files.length > 1) return finalContents;

  if (fs.existsSync(files[0])) {
    finalContents = removeHeader(finalContents);
  }
  return finalContents;
};

module.exports = {
  getCharacters,
  getLines,
  modifyContents,
  getContents,
  validateInput,
  head,
  formatContents,
  formatAllContents,
  tail
};
