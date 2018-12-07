const getCharacters = function(string, count) {
  return string.slice(0, count);
};

const getLines = function(string, count) {
  return string
    .split("\n")
    .slice(0, count)
    .join("\n");
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
const isOptionAndCount = x => x[0] == "-" && x.length > 2;
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

const isInputInvalid = function(input) {
  let state = false;
  let message = "";

  if (isCountInvalid(input[0])) {
    message = "head: illegal line count -- 0";
    state = true;
  }

  if (isOptionInvalid(input[0])) {
    message = `head: illegal option -- ${input[0][1]}
usage: head [-n lines | -c bytes] [file ...]`;
    state = true;
  }

  if (isCountZero(input[0])) {
    let option = { "-n": "line", "-c": "byte" };
    message = `head: illegal ${
      option[input[0].slice(0, 2)]
    } count -- ${input[0].slice(2)}`;
    state = true;
  }

  if (isCountAlphanumeric(input[0], input[1])) {
    let option = { "-n": "line", "-c": "byte" };
    message = `head: illegal ${option[input[0]]} count -- ${input[1]}`;
    state = true;
  }
  return { state, message };
};

const head = function(fs, inputs) {
  let { state, message } = isInputInvalid(inputs);

  if (state) return message;

  let parsedInputs = parseInputs(inputs);
  let { option, count, files } = parsedInputs;
  let process = { "-c": getCharacters, "-n": getLines };
  let mapper = process[option];
  let contents = getContents(fs, mapper, count, files);
  if (files.length == 1) {
    if (fs.existsSync(files[0])) {
      contents = fs.readFileSync(files[0], "utf8");
      contents = mapper(contents, count);
    }
  }
  return contents;
};

module.exports = {
  getCharacters,
  getLines,
  modifyContents,
  getContents,
  parseInputs,
  isInputInvalid,
  head
};
