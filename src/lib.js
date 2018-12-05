const getCharacters = function(string,count){
  return string.slice(0,count);
}

const getLines = function(string,count){
  return string.split('\n').slice(0,count).join('\n');
}

const mapper = function(fileReader,callback,count,file){
  let contents = fileReader(file, "utf8");
  let modifiedContents = callback(contents,count);
  modifiedContents = `==> ${file} <==\n${modifiedContents}`
  return modifiedContents;
}

const getContents = function(fileReader,callback,count,files){
  let callbackFunc = mapper.bind(null,fileReader,callback,count);
  return files.map(callbackFunc).join('\n');
}

const parseInputs = function(inputs){
  let states = {option:'-n',count:'10',files:inputs.slice()};

  if(inputs[0]=='-n'||inputs[0]=='-c'){
    states = {option:inputs[0],count:inputs[1],files:inputs.slice(2)}
  }
  if(inputs[0][0]=='-'& inputs[0].length>2){
    states = {option:inputs[0].slice(0,2),count:inputs[0].slice(2),files:inputs.slice(1)}
  }
  if(parseInt(inputs[0])){
    states = {option:'-n',count:Math.abs(inputs[0]),files:inputs.slice(1)}
  }
  return states;
}

const head = function(reader,inputs){
  let parsedInputs = parseInputs(inputs);
  let {option,count,files} = parsedInputs;
  let process = {'-c':getCharacters,'-n':getLines};
  let callback = process[option];
  let contents = getContents(reader,callback,count,files);
  if(files.length == 1){
    contents = contents.split('\n');
    contents.shift();
    contents = contents.join('\n');
  }
  return contents; 
}

module.exports = {getCharacters,
  getLines,
  mapper,
  getContents,
  parseInputs,
  head};

