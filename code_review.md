```file : ./src/lib.js
bad file name
line 17: bad function name
line 18: bad variable name 'modified contents'
        repetition in modifyContents() and formatContents()
line 42 : isNumber() to be moved in inputValidator()
line 72 : trimEnd() function can be renamed
getContents() and formatAllContents() can be a single function with slight change and better name
remove common part of head() and tail() function
line 90,95 rename callback
line 78 : In getCount funciton the count can be replaced with some other names.

file: ./src/inputValidator.js
function repetition...reduntant functions
line19: bad argument names
line 51:count errors can be extracted into a seperate function
line 33,21 are repeating and both can be a single function
file: ./src/inputParser.js
common functions in inputValidator.js and inputParser.js can be removed.

test:
add tests for low level functions.

head.js :
Order of arguments in function call of head

tail.js :
Order of arguments in function call of tail
require libraries outside main function
```
