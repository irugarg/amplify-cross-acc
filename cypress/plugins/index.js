const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor')

module.exports = on => {
  on('file:preprocessor', cypressTypeScriptPreprocessor)
}

module.exports = (on, config) => {
  config.ignoreTestFiles = "**/examples/*.spec.js";
  return config;
};
