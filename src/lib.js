const getCharacters = function(string,count){
  return string.slice(0,count);
}

const getLines = function(string,count){
  return string.split('\n').slice(0,count).join('\n');
}

const getContents = function(fileName,fileReader,encoding='utf8'){
  return fileReader(fileName,encoding); 
}

module.exports = {getCharacters,
  getLines,getContents};
