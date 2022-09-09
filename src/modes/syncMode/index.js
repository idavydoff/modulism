const path = require('path');
const { getConfigData } = require('../../utils/getConfigData');
const { updateConfigFile } = require('../../utils/updateConfigFile');
const getModules = require('../../getModules');

const syncMode = async () => {
  const configData = getConfigData();

  const { modules, moduleGroups } = await getModules(
    path.resolve(process.cwd(), configData.workDir), 
    configData.extensions.split(',').map((s) => s.trim()),
    configData.paths || {},
    configData.workDir
  );

  const res = {};

  const modulesKeys = Object.keys(modules);
  
  for (let i = 0; i < modulesKeys.length; i++) {
    const exports = [];

    for (let k = 0; k < modulesKeys.length; k++) {
      if (modules[modulesKeys[k]].map((m) => m.module).includes(modulesKeys[i])) {
        exports.push(modulesKeys[k]);
      }
    }

    res[modulesKeys[i]] = {
      imports: modules[modulesKeys[i]]
        .map((mod) => `${mod.module}${mod.group ? ':' + mod.group : ''}`)
        .sort((a, b) => a.localeCompare(b)),
      exports: exports.sort((a, b) => a.localeCompare(b)),
      groups: (moduleGroups[modulesKeys[i]] || []).map((gr) => ({...gr, url: gr.url.replace(process.cwd(), '')}))
    }
  }

  configData.modules = res;

  updateConfigFile(configData);

  console.log('\x1b[32m', "Modulism file updated!")
}

module.exports = syncMode;