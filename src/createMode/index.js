const { updateConfigFile } = require('../utils/updateConfigFile');
const { getConfigData } = require('../utils/getConfigData');
const { fireError } = require('../utils/fireError');

const createMode = async () => {
  const configData = getConfigData();
  const newModuleName = process.argv[3];

  if (!newModuleName) 
    fireError('ERROR: Provide a module name');

  configData.modules[newModuleName] = {
    imports: [],
    exports: []
  }

  updateConfigFile(configData);

  console.log('\x1b[32m', "Modulism config updated!")
}

module.exports = createMode;