const { updateConfigFile } = require('../utils/updateConfigFile');
const { getConfigData } = require('../utils/getConfigData');
const { fireError } = require('../utils/fireError');

const editMode = async () => {
  const configData = getConfigData();
  const targetModuleName = process.argv[3];
  const editType = process.argv[4];
  const moduleName = process.argv[5];

  if (!targetModuleName | !editType | !moduleName) 
    fireError('ERROR: Provide all arguments (Example: modulism edit <targetModuleName> <import|remove> <moduleName>)');  
  
  if (editType !== 'import' && editType !== 'remove') 
    fireError('ERROR: Second argument can only be "import" or "edit" (Example: modulism edit <targetModuleName> <import|remove> <moduleName>)');  

  if (!configData.modules[targetModuleName]) 
    fireError(`CONFIG ERROR: Module "${targetModuleName}" doesn't exist.`);  
  
  if (!configData.modules[moduleName]) 
    fireError(`CONFIG ERROR: Module "${moduleName}" doesn't exist.`);  

  if (editType === 'import') {
    if (configData.modules[targetModuleName].imports.includes(moduleName)) 
      fireError(`ERROR: Module "${targetModuleName}" already imports module "${moduleName}".`);    
    
    configData.modules[targetModuleName].imports.push(moduleName);
    if (!configData.modules[moduleName].exports.includes(targetModuleName)) {
      configData.modules[moduleName].exports.push(targetModuleName);
    }
  }
  if (editType === 'remove') {
    const targetIndex = configData.modules[targetModuleName].imports.findIndex((el) => el === moduleName);
    const moduleIndex = configData.modules[moduleName].exports.findIndex((el) => el === targetModuleName);
    
    if (targetIndex === -1) 
      fireError(`ERROR: Module "${targetModuleName}" doesn't import module "${moduleName}".`);    

    configData.modules[targetModuleName].imports.splice(targetIndex, 1);
    if (moduleName !== -1) {
      configData.modules[moduleName].exports.splice(moduleIndex, 1);
    }
  }

  updateConfigFile(configData);

  console.log('\x1b[32m', "Modulism config updated!")
}

module.exports = editMode;