const fs = require('fs');
const path = require('path');

const updateConfigFile = (configData) => {
  const configFilePath = path.resolve(process.cwd(), './config.modulism.json');
  fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2));
}

module.exports = {
  updateConfigFile
}
