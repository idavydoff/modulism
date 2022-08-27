const { updateConfigFile } = require('../../utils/updateConfigFile');
const { getConfigData } = require('../../utils/getConfigData');
const { fireError } = require('../../utils/fireError');

const renameMode = async () => {
  const configData = getConfigData();
  const targetModuleName = process.argv[3];
  const newModuleName = process.argv[4];

  if (!targetModuleName || !newModuleName) 
    fireError('ERROR: Provide all arguments (Example: modulism rename <targetModuleName> <newModuleName>)');  
  
  if (!configData.modules[targetModuleName]) 
    fireError(`CONFIG ERROR: Module "${targetModuleName}" doesn't exist.`);  
  
  if (configData.modules[newModuleName]) 
    fireError(`CONFIG ERROR: Module "${newModuleName}" already exists.`);  

  configData.modules[newModuleName] = {
    ...configData.modules[targetModuleName]
  };

  delete configData.modules[targetModuleName];

  const modulesNames = Object.keys(configData.modules);

  for (let i = 0; i < modulesNames.length; i++) {
    configData.modules[modulesNames[i]].imports = 
      configData.modules[modulesNames[i]].imports.map((mod) => mod === targetModuleName ? newModuleName : mod);
    configData.modules[modulesNames[i]].exports = 
      configData.modules[modulesNames[i]].exports.map((mod) => mod === targetModuleName ? newModuleName : mod);
  }

  updateConfigFile(configData);

  console.log('\x1b[32m', "Modulism config updated!")
}

module.exports = renameMode;