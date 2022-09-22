const { fireError } = require('./utils/fireError');
const { getConfigData } = require('./utils/getConfigData');
const { clearModulesFromGroups } = require('./utils/clearModulesFromGroups');

const checkConfigFileForErrors = () => {
  const configData = getConfigData();
  const isConfigDataAnObject = typeof configData === 'object' &&
  !Array.isArray(configData) &&
  configData !== null;
  if (!isConfigDataAnObject) {
    fireError("CONFIG ERROR: Config file doesn't contain an object.");
  }

  const errors = [];
  
  if (!configData.workDir) {
    errors.push(`CONFIG ERROR: Config file doesn't contain 'workDir' property.`)
  }
  if (!configData.workDir) {
    errors.push(`CONFIG ERROR: Config file doesn't contain 'extensions' property.`)
  }
  if (!configData.modules) {
    errors.push(`CONFIG ERROR: Config file doesn't contain 'modules' property.`)

    errors.forEach((e) => fireError(e, true));
    process.exit(1);
  }

  const configDataEntries = Object.entries(configData.modules);

  for (let i = 0; i < configDataEntries.length; i++) {
    const { imports, exports } = configDataEntries[i][1];
  
    const cImports = clearModulesFromGroups(imports);
    const cExports = clearModulesFromGroups(exports);

    const mName = configDataEntries[i][0];

    if (!cImports) {
      errors.push(`CONFIG ERROR: Module "${mName}" dosn't have "imports" field.`)
    }
    else if (!Array.isArray(cImports)) {
      errors.push(`CONFIG ERROR: "imports" field of module "${mName}" is not an array.`)
    }
    else {
      for (let k = 0; k < cImports.length; k++) {
        if (!configData.modules[cImports[k]]) {
          errors.push(`CONFIG ERROR: Module "${cImports[k]}" doesn't exist. Check module "${mName}" imports.`);
        }
        else if (!clearModulesFromGroups(configData.modules[cImports[k]].exports).includes(mName)) {
          errors.push(`CONFIG ERROR: Module "${mName}" has an import for module "${cImports[k]}" but this module's exports doesn't include module "${mName}".`)
        }
      }
    }

    if (!cExports) {
      errors.push(`CONFIG ERROR: Module "${mName}" dosn't have "exports" field.`)
    }
    else if (!Array.isArray(cExports)) {
      errors.push(`CONFIG ERROR: "exports" field of module "${mName}" is not an array.`)
    }
    else {
      for (let k = 0; k < cExports.length; k++) {
        if (!configData.modules[cExports[k]]) {
          errors.push(`CONFIG ERROR: Module "${cExports[k]}" doesn't exist. Check module "${mName}" exports.`);
        }
        else if (!clearModulesFromGroups(configData.modules[cExports[k]].imports).includes(mName)) {
          errors.push(`CONFIG ERROR: Module "${mName}" has an export for module "${cExports[k]}" but this module's imports doesn't include module "${mName}".`)
        }
      }
    }
  }

  if (errors.length) {
    errors.forEach((e) => fireError(e, true));
    process.exit(1);
  }
}

module.exports = {
  checkConfigFileForErrors
}