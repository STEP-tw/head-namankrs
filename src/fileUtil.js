const { parseInput, validateInput } = require("./parser.js");

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
  let fetchContents = func[option];
  return { files, count, fetchContents, option };
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

const getRequiredContent = function(details) {
  let { command, fs, fetchContents, count, filePath } = details;
  let formattedContents = `${command}: ${filePath}: No such file or directory`;
  if (fs.existsSync(filePath)) {
    let contents = getContent(filePath, fs);
    let { endIndex, initIndex } = getCounts(contents, fetchContents, count);
    const commands = {
      head: fetchContents(contents, count),
      tail: fetchContents(contents, endIndex, initIndex)
    };
    formattedContents = commands[command];
  }
  return formattedContents;
};

const filterContent = function(fs, fetchContents, count, command, filePath) {
  let details = { command, fs, fetchContents, count, filePath };
  let formattedContents = getRequiredContent(details);
  if (fs.existsSync(filePath))
    formattedContents = addHeader(filePath, formattedContents);

  return formattedContents;
};

const runCommand = function(details) {
  let { fs, fetchContents, count, files, command } = details;
  let callback = filterContent.bind(null, fs, fetchContents, count, command);
  return files.map(callback).join("\n");
};

const finaliseContents = function(files, contents, fs) {
  if (files.length > 1) return contents;

  if (fs.existsSync(files[0])) {
    contents = removeHeader(contents);
  }
  return contents;
};

const head = function(inputs, fs) {
  let { errorState, message } = validateInput(inputs);
  if (errorState) return message;

  let { files, count, fetchContents } = extractDetails(inputs);
  let details = { fs, fetchContents, count, files, command: "head" };
  let contents = runCommand(details);
  return finaliseContents(files, contents, fs);
};

const tail = function(inputs, fs) {
  let { files, count, fetchContents, option } = extractDetails(inputs);
  if (!isNumber(count)) {
    return `tail: illegal offset -- ${count}`;
  }
  if (!fetchContents) {
    return `tail: illegal option -- ${option[1]}
usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]`;
  }
  let details = { fs, fetchContents, count, files, command: "tail" };
  let contents = runCommand(details);

  return finaliseContents(files, contents, fs);
};

module.exports = {
  getCharacters,
  getLines,
  head,
  filterContent,
  runCommand,
  tail
};
