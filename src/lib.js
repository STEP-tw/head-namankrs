const { parseInput } = require("./parseInput.js");
const { validateInput } = require("./validateInput.js");
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

const getCounts = function(contents, mapper, count) {
  let endCount = contents.length;
  let initCount = endCount - count;
  if (mapper == getLines) {
    endCount = contents.split("\n").length;
    initCount = endCount - count;
  }
  if (count > endCount) initCount = 0;
  return { endCount, initCount };
};

const formatContents = function(fs, mapper, count, file) {
  let formattedContents = `tail: ${file}: No such file or directory`;
  if (fs.existsSync(file)) {
    let contents = fs.readFileSync(file, "utf8");
    if (contents.endsWith("\n")) {
      contents = trimEnd(contents);
    }
    let { endCount, initCount } = getCounts(contents, mapper, count);
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
  head,
  formatContents,
  formatAllContents,
  tail
};
