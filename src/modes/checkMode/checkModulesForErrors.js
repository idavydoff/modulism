const { fireError } = require('../../utils/fireError');
const { clearModulesFromGroups } = require('../../utils/clearModulesFromGroups');

const checkModulesForErrors = (configData, files, modules) => {
  const configDataEntries = Object.entries(configData);
  const filesEntries = Object.entries(files);

  const errors = [];

  for (let i = 0; i < filesEntries.length; i++) {
    const curFile = filesEntries[i];
    const { module, imports } = curFile[1];

    const curFileImports = Array.from(new Set(imports.map((m) => m.module)));
    
    for (let k = 0; k < curFileImports.length; k++) {
      if (!configData[module]) {
        errors.push(`ERROR: Module "${module}" doesn't exist in config.modulism.json file.`);
      }
      else if (!clearModulesFromGroups(configData[module].imports).includes(curFileImports[k])) {
        errors.push(`ERROR: File "${curFile[0]}" of module "${module}" is importing module "${curFileImports[k]}". Module "${module}" doesn't importing module "${curFileImports[k]}" in modulism config.`)
      }

      if (!configData[curFileImports[k]]) {
        errors.push(`ERROR: Module "${curFileImports[k]}" doesn't exist in config.modulism.json file.`);
      }
      else if (!clearModulesFromGroups(configData[curFileImports[k]].exports).includes(module)) {
        errors.push(`ERROR: File "${curFile[0]}" of module "${module}" is importing module "${curFileImports[k]}". Module "${curFileImports[k]}" doesn't exporting to module "${module}" in modulism config.`)
      }
    }
  }

  for (let i = 0; i < configDataEntries.length; i++) {
    const mName = configDataEntries[i][0];
    const { imports, exports } = configDataEntries[i][1];

    const cImports = clearModulesFromGroups(imports);
    const cExports = clearModulesFromGroups(exports);

    if (!modules[mName]) {
      errors.push(`ERROR: Module "${mName}" doesn't exist in code (modulism file not found or the module doesn't have ts|tsx|js|jsx files).`);
      continue;
    }

    for (let k = 0; k < cImports.length; k++) {
      if (!modules[mName].includes(cImports[k])) {
        errors.push(`ERROR: Module "${mName}" doesn't importing module "${cImports[k]}" like it must.`)
      }
    }

    for (let k = 0; k < cExports.length; k++) {
      if (!modules[cExports[k]]) {
        errors.push(`ERROR: Module "${cExports[k]}" doesn't exist in code.`);
      }
      else if (!modules[cExports[k]].includes(mName)) {
        errors.push(`ERROR: Module "${mName}" doesn't exporting to module "${cExports[k]}" like it must.`)
      }
    }
    
  }

  if (errors.length) {
    errors.forEach((e) => fireError(e, true));
    process.exit(1);
  }
}

module.exports = {
  checkModulesForErrors
}