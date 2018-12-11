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

const isOptionValid = x => x == "-n" || x == "-c";

const isOption = x => x[0] == "-" && isNaN(x[1]);
const isOptionAndCount = x => isOption(x) && x.length > 2;

const isCountValid = x => !isNaN(x);

const parseOptionInput = function(inputs) {
  return { option: inputs[0], count: inputs[1], files: inputs.slice(2) };
};

const parseOptionAndCountInput = function(inputs) {
  return {
    option: inputs[0].slice(0, 2),
    count: inputs[0].slice(2),
    files: inputs.slice(1)
  };
};

const parseCountInput = function(inputs) {
  return {
    option: "-n",
    count: Math.abs(inputs[0]),
    files: inputs.slice(1)
  };
};

const parseInputs = function(inputs) {
  let states = { option: "-n", count: "10", files: inputs.slice() };

  if (isOptionValid(inputs[0])) {
    return parseOptionInput(inputs);
  }

  if (isOptionAndCount(inputs[0])) {
    return parseOptionAndCountInput(inputs);
  }

  if (isCountValid(inputs[0])) {
    return parseCountInput(inputs);
  }
  return states;
};

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

const head = function(fs, inputs) {
  let { option, count, files } = parseInputs(inputs);
  let process = { "-c": getCharacters, "-n": getLines };
  let mapper = process[option];
  let contents = getContents(fs, mapper, count, files);
  return { files, contents, count, mapper };
};

const runHead = function(fs, inputs) {
  let { errorState, message } = validateInput(inputs);
  if (errorState) return message;

  let { files, contents, count, mapper } = head(fs, inputs);
  if (files.length > 1) return contents;

  if (fs.existsSync(files[0])) {
    contents = fs.readFileSync(files[0], "utf8");
    contents = mapper(contents, count);
  }
  return contents;
};

const trimEnd = function(contents) {
  contents = contents.split("\n");
  contents.pop();
  return contents.join("\n");
};

const formatContents = function(fs, mapper, count, file) {
  let formattedContents = `tail: ${file}: No such file or directory`;
  if (fs.existsSync(file)) {
    let contents = fs.readFileSync(file, "utf8");
    if (contents.endsWith("\n")) {
      contents = trimEnd(contents);
    }
    let endCount = contents.length;
    let initCount = endCount - count;
    if (mapper == getLines) {
      endCount = contents.split("\n").length;
      initCount = endCount - count;
    }
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
  let { option, count, files } = parseInputs(inputs);
  let process = { "-c": getCharacters, "-n": getLines };
  let mapper = process[option];
  let finalContents = formatAllContents(fs, mapper, count, files);

  if (!isCountValid(count)) {
    return `tail: illegal offset -- ${count}`;
  }
  if (files.length > 1) return finalContents;

  if (fs.existsSync(files[0])) {
    finalContents = finalContents.split("\n");
    finalContents.shift();
    finalContents = finalContents.join("\n");
  }
  return finalContents;
};

module.exports = {
  getCharacters,
  getLines,
  modifyContents,
  getContents,
  parseInputs,
  validateInput,
  runHead,
  formatContents,
  formatAllContents,
  tail
};
