const isNumber = x => !isNaN(x);

const isAlphanumeric = x => isNaN(x) && x[0] === "-";

const isOptionAndCount = x => isAlphanumeric(x) && x.length > 2;

const isCountZero = x => x === "-0";

const isAlphabetOrZero = x => isNaN(x.slice(2)) || x.slice(2) === "0";

const hasOption = x => x === "-n" || x === "-c";

const hasInvalidCount = x => x < 1 || isNaN(x);

const isCountInvalid = x => isAlphabetOrZero(x) && hasOption(x.slice(0, 2));

const lacksOption = x => !x.includes("-c") && !x.includes("-n");

const isOptionInvalid = x => lacksOption(x) && isAlphanumeric(x);

const isOptionWithAlphanumericCount = (x, y) =>
  hasOption(x) && hasInvalidCount(y);

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

const validateHeadInput = function(input) {
  const possibleOptionOrCount = input[0];
  let errorState = false;
  let message = "";

  if (isCountZero(possibleOptionOrCount)) {
    return zeroCountError();
  }

  if (isOptionInvalid(possibleOptionOrCount)) {
    return invalidOptionError(possibleOptionOrCount);
  }

  if (isCountInvalid(possibleOptionOrCount)) {
    return invalidCountError(possibleOptionOrCount);
  }

  if (isOptionWithAlphanumericCount(possibleOptionOrCount, input[1])) {
    return alphanumericCountError(possibleOptionOrCount, input[1]);
  }
  return { errorState, message };
};

const illegalOptionError = function(option) {
  return {
    message: `tail: illegal option -- ${option}
usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]`,
    errorState: true
  };
};

const illegalOffsetError = function(count) {
  return { message: `tail: illegal offset -- ${count}`, errorState: true };
};

const validateTailInput = function(count, option, fetchContents) {
  if (!isNumber(count)) {
    return illegalOffsetError(count);
  }
  if (!fetchContents) {
    return illegalOptionError(option[1]);
  }
  return { message: "", errorState: false };
};

const parseInput = function(inputs) {
  const possibleOptionOrCount = inputs[0];
  let states = { option: "-n", count: "10", files: inputs.slice() };

  if (hasOption(possibleOptionOrCount)) {
    return parseOptionInput(inputs);
  }

  if (isOptionAndCount(possibleOptionOrCount)) {
    return parseOptionAndCountInput(inputs);
  }

  if (isNumber(possibleOptionOrCount)) {
    return parseCountInput(inputs);
  }
  return states;
};

module.exports = {
  parseInput,
  validateHeadInput,
  validateTailInput
};
