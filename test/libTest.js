let {equal,deepEqual} = require('assert');
let {getCharacters} = require('../src/lib.js');

describe('getCharacters',function(){
  it('should return a empty string when count is given as 0',function(){
    equal(getCharacters('naman',0),'');
  })
  it('should return a set of characters when count greater than 0 is given',function(){
    equal(getCharacters('naman',3),'nam');
  })
  it('should return the whole string if count greater than string length is given',function(){
    equal(getCharacters('naman',10),'naman');
  })
})
