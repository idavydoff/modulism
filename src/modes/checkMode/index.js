const path = require('path');
const { checkModulesForErrors } = require('./checkModulesForErrors');
const { getConfigData } = require('../../utils/getConfigData');
const getModules = require('../../getModules');

const checkMode = async () => {
  const configData = getConfigData();

  const { files, modules } = await getModules(
    path.resolve(process.cwd(), configData.workDir), 
    configData.extensions.split(',').map((s) => s.trim()),
    configData.paths || {},
    configData.workDir
  );

  checkModulesForErrors(configData.modules, files, modules);

  console.log('\x1b[32m', "Modulism check succeded!")
}

module.exports = checkMode;