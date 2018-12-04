const getCharacters = function(string,count){
  return string.slice(0,count);
}

const getLines = function(string,count){
  return string.split('\n').slice(0,count).join('\n');
}

module.exports = {getCharacters,
  getLines};
