const getCharacters = function(string,count){
  return string.slice(0,count);
}

const getLines = function(string,count){
  return string.split('\n').slice(0,count).join('\n');
}

const mapper = function(fs,callback,count,file){
  let modifiedContents = `head: ${file}: No such file or directory`;
  if(fs.existsSync(file)){
  let contents = fs.readFileSync(file, "utf8");
  modifiedContents = callback(contents,count);
  modifiedContents = `==> ${file} <==\n${modifiedContents}`
  }
  return modifiedContents;
}

const getContents = function(fs,callback,count,files){
  let callbackFunc = mapper.bind(null,fs,callback,count);
  return files.map(callbackFunc).join('\n');
}

const parseInputs = function(inputs){
  let states = {option:'-n',count:'10',files:inputs.slice()};

  if(inputs[0]=='-n'||inputs[0]=='-c'){
    states = {option:inputs[0],count:inputs[1],files:inputs.slice(2)}
  }
  if(inputs[0][0]=='-' && inputs[0].length>2){
    states = {option:inputs[0].slice(0,2),count:inputs[0].slice(2),files:inputs.slice(1)}
  }
  if(parseInt(inputs[0])){
    states = {option:'-n',count:Math.abs(inputs[0]),files:inputs.slice(1)}
  }
  return states;
}

const head = function(fs,inputs){

  const isCountInvalid = (inputs[0] == '-0');
  if(isCountInvalid)
    return 'head: illegal line count -- 0';

  const isOptionInvalid = (!inputs[0].includes('-c') &&
                          !inputs[0].includes('-n') &&
                          isNaN(inputs[0]) &&
                          inputs[0][0] == '-');
  if(isOptionInvalid){
    return `head: illegal option -- ${inputs[0][1]}
usage: head [-n lines | -c bytes] [file ...]`
  }

  if((isNaN(inputs[0].slice(2)) || inputs[0].slice(2) == '0') && (inputs[0].slice(0,2) =='-n'||inputs[0].slice(0,2) == '-c')){
    let option = {'-n':'line','-c':'byte'}
    return `head: illegal ${option[inputs[0].slice(0,2)]} count -- ${inputs[0].slice(2)}`
  }

  let parsedInputs = parseInputs(inputs);
  let {option,count,files} = parsedInputs;
  let process = {'-c':getCharacters,'-n':getLines};
  let callback = process[option];
  let contents = getContents(fs,callback,count,files);
  if(files.length == 1){
    if(fs.existsSync(files[0])){
      contents = fs.readFileSync(files[0], "utf8");
      contents =  callback(contents,count);
    }
  }
  return contents; 
}

module.exports = {getCharacters,
  getLines,
  mapper,
  getContents,
  parseInputs,
  head};

