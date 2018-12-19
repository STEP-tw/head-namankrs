const isOptionValid = x => x === "-n" || x === "-c";

const isOption = x => x[0] === "-" && isNaN(x[1]);
const isOptionAndCount = x => isOption(x) && x.length > 2;

const isCountValid = x => !isNaN(x);

const parseOptionInput = function(inputs) {
  return { option: inputs[0], count: inputs[1], files: inputs.slice(2) };
};
const isCountZero = x => x === "-0";

const lacksOption = x => !x.includes("-c") && !x.includes("-n");

const isAlphanumeric = x => isNaN(x) && x[0] === "-";

const isOptionInvalid = x => lacksOption(x) && isAlphanumeric(x);

const isAlphabetOrZero = x => isNaN(x.slice(2)) || x.slice(2) === "0";

const hasOption = x => x === "-n" || x === "-c";

const isCountInvalid = x => isAlphabetOrZero(x) && hasOption(x.slice(0, 2));

const hasInvalidCount = x => x < 1 || isNaN(x);

const isCountAlphanumeric = (x, y) => hasOption(x) && hasInvalidCount(y);

const zeroCountError = function() {
  return { message: "head: illegal line count -- 0", errorState: true };
};

const invalidOptionError = function(input) {
  return {
    message: `head: illegal option -- ${input[1]}
usage: head [-n lines | -c bytes] [file ...]`,
    errorState: true
  };
};

const invalidCountError = function(input) {
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

const validateInput = function(input) {
  let errorState = false;
  let message = "";

  if (isCountZero(input[0])) {
    return zeroCountError();
  }

  if (isOptionInvalid(input[0])) {
    return invalidOptionError(input[0]);
  }
  if (isCountInvalid(input[0])) {
    return invalidCountError(input[0]);
  }

  if (isCountAlphanumeric(input[0], input[1])) {
    return alphanumericCountError(input[0], input[1]);
  }
  return { errorState, message };
};

const parseInput = function(inputs) {
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

module.exports = { parseInput, validateInput };
