const getCharacters = function(string,count){
  return string.slice(0,count);
}

const getLines = function(string,count){
  return string.split('\n').slice(0,count).join('\n');
}

const mapper = function(fileReader,callback,count,file){
  let contents = fileReader(file, "utf8");
  let modifiedContents = callback(contents,count);
  modifiedContents = `==>${file}<==\n${modifiedContents}`
  return modifiedContents;
}

const getContents = function(fileReader,callback,count,files){
  let callbackFunc = mapper.bind(null,fileReader,callback,count);
  return files.map(callbackFunc).join('\n');
}

const parseInputs = function(inputs){
  let states = {option:'-n',count:'10',files:[inputs[0]]};
  if(inputs.length>1){
    states.option = inputs[0].split('').slice(0,2).join('');
    states.count = inputs[1];
    states.files = inputs.slice(2,inputs.length);
    if(isNaN(inputs[1])){
      let length = inputs[0].length;
      states.count = inputs[0].split('').slice(2,length).join('');
      states.files = inputs.slice(1,inputs.length);
    }
  }
  return states;
}

const head = function(reader,inputs){
  let parsedInputs = parseInputs(inputs);
  let {option,count,files} = parsedInputs;
  let process = {'-c':getCharacters,'-n':getLines};
  let callback = process[option];
  console.log(callback);
  return getContents(reader,callback,count,files);
}

module.exports = {getCharacters,
  getLines,
  mapper,
  getContents,
parseInputs,head};

