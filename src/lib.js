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
  let fetchContent = func[option];
  return { files, count, fetchContent };
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

const getCounts = function(contents, fetchContent, count) {
  let endIndex = contents.length;
  let initIndex = endIndex - count;
  if (fetchContent === getLines) {
    endIndex = contents.split("\n").length;
    initIndex = endIndex - count;
  }
  if (count > endIndex) initIndex = 0;
  return { endIndex, initIndex };
};

const getContents = function(filePath, fs) {
  let contents = fs.readFileSync(filePath, "utf8");
  if (contents.endsWith("\n")) {
    contents = trimLastLine(contents);
  }
  return contents;
};

const filterContent = function(fs, fetchContent, count, command, filePath) {
  let formattedContents = `${command}: ${filePath}: No such file or directory`;
  if (fs.existsSync(filePath)) {
    let contents = getContents(filePath, fs);
    let { endIndex, initIndex } = getCounts(contents, fetchContent, count);
    const commands = {
      head: fetchContent(contents, count),
      tail: fetchContent(contents, endIndex, initIndex)
    };
    formattedContents = commands[command];
    formattedContents = addHeader(filePath, formattedContents);
  }
  return formattedContents;
};

const runCommand = function(fs, fetchContent, count, files, command) {
  let callback = filterContent.bind(null, fs, fetchContent, count, command);
  return files.map(callback).join("\n");
};

const head = function(inputs, fs) {
  let { errorState, message } = validateInput(inputs);
  if (errorState) return message;

  let { files, count, fetchContent } = extractDetails(inputs);
  let contents = runCommand(fs, fetchContent, count, files, "head");

  if (files.length > 1) return contents;

  if (fs.existsSync(files[0])) {
    contents = removeHeader(contents);
  }
  return contents;
};

const tail = function(inputs, fs) {
  let { files, count, fetchContent } = extractDetails(inputs);
  let finalContents = runCommand(fs, fetchContent, count, files, "tail");

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
