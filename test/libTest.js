let {equal,deepEqual} = require('assert');
let {getCharacters,
  getLines} = require('../src/lib.js');

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
