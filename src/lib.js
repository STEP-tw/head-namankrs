const getCharacters = function(string,count){
  return string.slice(0,count);
}

const getLines = function(string,count=10){
  return string.split('\n').slice(0,count).join('\n');
}

const mapper = function(fileReader,callback,count,file){
  let contents = fileReader(file);
  let modifiedContents = callback(contents,count);
  modifiedContents = `==>${file}<==\n${modifiedContents}`
  return modifiedContents;
}



module.exports = {getCharacters,
  getLines,
  mapper};

