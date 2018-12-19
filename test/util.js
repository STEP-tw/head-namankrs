const mockReader = function(expectedFile, expectedContent) {
  return function(actualFile) {
    if (actualFile === expectedFile) {
      return expectedContent;
    }
  };
};

const mockValidator = function(expectedFile) {
  return function(actualFile) {
    return actualFile === expectedFile;
  };
};

module.exports = { mockReader, mockValidator };
