const getCharacters = function(string,count){
  return string.slice(0,count);
}

const getLines = function(string,count=10){
  return string.split('\n').slice(0,count).join('\n');
}

const getContents = function(fileName,fileReader,encoding='utf8'){
  return fileReader(fileName,encoding); 
}

const parseInputs = function(inputs){
  return inputs[2];
}

module.exports = {getCharacters,
  getLines,getContents,parseInputs};
