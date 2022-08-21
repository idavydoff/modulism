const { updateConfigFile } = require('../utils/updateConfigFile');
const { getConfigData } = require('../utils/getConfigData');
const { fireError } = require('../utils/fireError');

const deleteMode = async () => {
  const configData = getConfigData();
  const moduleToDeleteName = process.argv[3];

  if (!moduleToDeleteName) 
    fireError('ERROR: Provide a module name');

  if (!configData.modules[moduleToDeleteName]) 
    fireError(`CONFIG ERROR: Module "${moduleToDeleteName}" doesn't exist.`);  

  delete configData.modules[moduleToDeleteName];

  const modulesNames = Object.keys(configData.modules);

  for (let i = 0; i < modulesNames.length; i++) {
    const importsIndex = configData.modules[modulesNames[i]].imports.findIndex((el) => el === moduleToDeleteName);
    const exportsIndex = configData.modules[modulesNames[i]].exports.findIndex((el) => el === moduleToDeleteName);

    if (importsIndex > -1) {
      configData.modules[modulesNames[i]].imports.splice(importsIndex, 1);
    }
    if (exportsIndex > -1) {
      configData.modules[modulesNames[i]].exports.splice(exportsIndex, 1);
    }
  }

  updateConfigFile(configData);

  console.log('\x1b[32m', "Modulism config updated!")
}

module.exports = deleteMode;