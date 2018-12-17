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

const extractDetails = function(inputs) {
  let { option, count, files } = parseInput(inputs);
  let func = { "-c": getCharacters, "-n": getLines };
  let mapper = func[option];
  return { files, count, mapper };
};

const removeHeader = function(contents) {
  let trimmedContents = contents.split("\n");
  trimmedContents.shift();
  return trimmedContents.join("\n");
};

const isNumber = x => !isNaN(x);

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

const getContent = function(filePath, fs) {
  let contents = fs.readFileSync(filePath, "utf8");
  if (contents.endsWith("\n")) {
    contents = trimLastLine(contents);
  }
  return contents;
};

const filterContent = function(fs, fetchContents, count, command, filePath) {
  let formattedContents = `${command}: ${filePath}: No such file or directory`;
  if (fs.existsSync(filePath)) {
    let contents = getContent(filePath, fs);
    let { endIndex, initIndex } = getCounts(contents, fetchContents, count);
    const commands = {
      head: fetchContents(contents, count),
      tail: fetchContents(contents, endIndex, initIndex)
    };
    formattedContents = commands[command];
    formattedContents = addHeader(filePath, formattedContents);
  }
  return formattedContents;
};

const runCommand = function(fs, mapper, count, files, command) {
  let callback = filterContent.bind(null, fs, mapper, count, command);
  return files.map(callback).join("\n");
};

const head = function(inputs, fs) {
  let { errorState, message } = validateInput(inputs);
  if (errorState) return message;

  let { files, count, mapper } = extractDetails(inputs);
  let contents = runCommand(fs, mapper, count, files, "head");

  if (files.length > 1) return contents;

  if (fs.existsSync(files[0])) {
    contents = removeHeader(contents);
  }
  return contents;
};

const tail = function(inputs, fs) {
  let { files, count, mapper } = extractDetails(inputs);
  let finalContents = runCommand(fs, mapper, count, files, "tail");

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
  head,
  filterContent,
  runCommand,
  tail
};
