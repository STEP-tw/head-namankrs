const { parseInput } = require("./inputParser");
const { validateInput } = require("./inputValidator");

const getCharacters = function(contents, endIndex, initIndex = 0) {
  return contents.slice(initIndex, endIndex);
};

const getLines = function(contents, endIndex, initIndex = 0) {
  let lines = contents.split("\n");
  return lines.slice(initIndex, endIndex).join("\n");
};

const addHeader = function(header, contents) {
  return `==> ${header} <==\n${contents}`;
};

const modifyContents = function(fs, mapper, count, filePath) {
  let modifiedContents = `head: ${filePath}: No such file or directory`;
  if (fs.existsSync(filePath)) {
    let contents = fs.readFileSync(filePath, "utf8");
    modifiedContents = mapper(contents, count);
    modifiedContents = addHeader(filePath, modifiedContents);
  }
  return modifiedContents;
};

const formatContents = function(fs, mapper, count, filePath) {
  let formattedContents = `tail: ${filePath}: No such file or directory`;
  if (fs.existsSync(filePath)) {
    let contents = fs.readFileSync(filePath, "utf8");
    if (contents.endsWith("\n")) {
      contents = trimLastLine(contents);
    }
    let { endIndex, initIndex } = getCounts(contents, mapper, count);
    if (count > endIndex) initIndex = 0;
    formattedContents = mapper(contents, endIndex, initIndex);
    formattedContents = addHeader(filePath, formattedContents);
  }
  return formattedContents;
};

const isNumber = x => !isNaN(x);

const extractDetails = function(inputs) {
  let { option, count, files } = parseInput(inputs);
  let func = { "-c": getCharacters, "-n": getLines };
  let mapper = func[option];
  return { files, count, mapper };
};
``;
const removeHeader = function(contents) {
  let trimmedContents = contents.split("\n");
  trimmedContents.shift();
  return trimmedContents.join("\n");
};

const head = function(inputs, fs) {
  let { errorState, message } = validateInput(inputs);
  if (errorState) return message;

  let { files, count, mapper } = extractDetails(inputs);
  let contents = getContents(fs, mapper, count, files);

  if (files.length > 1) return contents;

  if (fs.existsSync(files[0])) {
    contents = removeHeader(contents);
  }
  return contents;
};

const trimLastLine = function(contents) {
  contents = contents.split("\n");
  contents.pop();
  return contents.join("\n");
};

const getCounts = function(contents, mapper, count) {
  let endIndex = contents.length;
  let initIndex = endIndex - count;
  if (mapper === getLines) {
    endIndex = contents.split("\n").length;
    initIndex = endIndex - count;
  }
  if (count > endIndex) initIndex = 0;
  return { endIndex, initIndex };
};

const formatAllContents = function(fs, mapper, count, files) {
  let callback = formatContents.bind(null, fs, mapper, count);
  return files.map(callback).join("\n");
};

const getContents = function(fs, mapper, count, files) {
  let callback = modifyContents.bind(null, fs, mapper, count);
  return files.map(callback).join("\n");
};

const tail = function(inputs, fs) {
  let { files, count, mapper } = extractDetails(inputs);
  let finalContents = formatAllContents(fs, mapper, count, files);

  if (!isNumber(count)) {
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
