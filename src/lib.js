const getCharacters = function(string,count){
  return string.slice(0,count);
}

const getLines = function(string,count){
  return string.split('\n').slice(0,count).join('\n');
}

const modifyContents = function(fs,mapper,count,file){
  let modifiedContents = `head: ${file}: No such file or directory`;
  if(fs.existsSync(file)){
    let contents = fs.readFileSync(file, "utf8");
    modifiedContents = mapper(contents,count);
    modifiedContents = `==> ${file} <==\n${modifiedContents}`
  }
  return modifiedContents;
}

const getContents = function(fs,mapper,count,files){
  let callback = modifyContents.bind(null,fs,mapper,count);
  return files.map(callback).join('\n');
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

const isInputInvalid = function(input){
  let state = false;
  let message = '';

  const isCountInvalid = (input[0] == '-0');
  if(isCountInvalid){
    message = 'head: illegal line count -- 0';
    state = true;
  }

  let lacksOption = (!input[0].includes('-c') && !input[0].includes('-n')); 
  let isAlphanumeric = isNaN(input[0]) && input[0][0] == '-';
  const isOptionInvalid = lacksOption && isAlphanumeric
  if(isOptionInvalid){
    message =  `head: illegal option -- ${input[0][1]}
usage: head [-n lines | -c bytes] [file ...]`;
    state = true;
  }

  let isAlphabetOrZero = (isNaN(input[0].slice(2)) || input[0].slice(2) == '0'); 
  let isValidOption = (input[0].slice(0,2) =='-n'||input[0].slice(0,2) == '-c');
  const isCountZero = isAlphabetOrZero && isValidOption;
      if(isCountZero){
    let option = {'-n':'line','-c':'byte'};
    message =  `head: illegal ${option[input[0].slice(0,2)]} count -- ${input[0].slice(2)}`
    state = true;
  }

  let hasOption = (input[0]=='-n'||input[0]=='-c'); 
  let hasInvalidCount = (input[1]<1||isNaN(input[1]));
  const isCountAlphanumeric = hasOption && hasInvalidCount;
    if(isCountAlphanumeric){  
    let option = {'-n':'line','-c':'byte'}
    message =  `head: illegal ${option[input[0]]} count -- ${input[1]}`;
    state = true;
  }
  return {state,message};
}

const head = function(fs,inputs){
  let{state,message} = isInputInvalid(inputs);

  if(state)
    return message;
  
  let parsedInputs = parseInputs(inputs);
  let {option,count,files} = parsedInputs;
  let process = {'-c':getCharacters,'-n':getLines};
  let mapper = process[option];
  let contents = getContents(fs,mapper,count,files);
  if(files.length == 1){
    if(fs.existsSync(files[0])){
      contents = fs.readFileSync(files[0], "utf8");
      contents =  mapper(contents,count);
    }
  }
  return contents; 
}

module.exports = {getCharacters,
  getLines,
  modifyContents,
  getContents,
  parseInputs,
  isInputInvalid,
  head};

