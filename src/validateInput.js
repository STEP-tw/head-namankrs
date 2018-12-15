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

exports.validateInput = validateInput;