let {equal,deepEqual} = require('assert');
let {getCharacters,
  getLines,
  mapper,
  parseInputs,
  getContents} = require('../src/lib.js');
describe('getCharacters',function(){
  it('should return an empty string when count is given as 0',function(){
    equal(getCharacters('naman',0),'');
  })
  it('should return a set of characters when count greater than 0 is given',function(){
    equal(getCharacters('naman',3),'nam');
  })
  it('should return the whole string if count greater than string length is given',function(){
    equal(getCharacters('naman',10),'naman');
  })
})

describe('getLines',function(){
  let input = 'there are\nfew fruits in \n the orchard.'
  it('should return an empty string when count is given as 0',function(){
    equal(getLines(input,0),'');
  })
  it('should return the number of lines as specified by count',function(){
    let expectedOutput = 'there are\nfew fruits in ' 
    equal(getLines(input,2),expectedOutput);
    equal(getLines(input,1),'there are');
  })
  it('should return whole string if specified count is more than the number of lines in string',function(){
    let expectedOutput = 'there are\nfew fruits in \n the orchard.'
    equal(getLines(input,10),expectedOutput);
  })
})

describe('mapper',function(){
  it('should return the formatted content of a single file',function(){
    let fileReader = (x)=>x;
    let string = 'hello world'
    let expectedOutput = '==>hello world<==\nhello world';
    equal(mapper(fileReader,getLines,1,string),expectedOutput);

  })
})

describe('getContents',function(){
  it('should return the formatted content of an array of files',function(){
    let fileReader = (x)=>x;
    let files = ['hello','world']; 
    let expectedOutput = '==>hello<==\nhello\n==>world<==\nworld';
    deepEqual(getContents(fileReader,getLines,1,files),expectedOutput);
  })
})

describe('parseInputs',function(){
  it('should return the default state when no option and count are provided',function(){
    deepEqual(parseInputs(['head.js']),{option:'-n',count:'10',files:['head.js']});
  })
  it('should change the default when some states are given',function(){
    deepEqual(parseInputs(['-n','5','hello','world']),{option:'-n',count:'5',files:['hello','world']});
    deepEqual(parseInputs(['-c','5','hello','world']),{option:'-c',count:'5',files:['hello','world']});
  })
  it('should work when option and count are not seperated by space',function(){
    deepEqual(parseInputs(['-c5','hello','world']),{option:'-c',count:'5',files:['hello','world']});
  })
   it('',function(){
   })
})
