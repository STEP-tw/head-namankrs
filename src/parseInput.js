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

exports.parseInput = parseInput;