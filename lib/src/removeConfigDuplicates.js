const { getConfigData } = require("./utils/getConfigData");
const { updateConfigFile } = require('./utils/updateConfigFile')

const removeConfigDuplicates = () => {
  const configData = getConfigData();

  const modulesNames = Object.keys(configData.modules);

  for (let i = 0; i < modulesNames.length; i++) {
    configData.modules[modulesNames[i]].imports = [...new Set(configData.modules[modulesNames[i]].imports)];
    configData.modules[modulesNames[i]].exports = [...new Set(configData.modules[modulesNames[i]].exports)];
  }

  updateConfigFile(configData);
}

module.exports = {
  removeConfigDuplicates
}
