const { getConfigData } = require('./utils/getConfigData');

const checkConfigFileForErrors = () => {
  const configData = getConfigData();
  const isConfigDataAnObject = typeof configData === 'object' &&
  !Array.isArray(configData) &&
  configData !== null;
  if (!isConfigDataAnObject) {
    console.log('\x1b[31m', `CONFIG ERROR: Config file doesn't contain an object.`)
    process.exit(1);
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

    errors.forEach((e) => console.log('\x1b[31m', e));
    process.exit(1);
  }

  const configDataEntries = Object.entries(configData.modules);

  for (let i = 0; i < configDataEntries.length; i++) {
    const { imports, exports } = configDataEntries[i][1];
    const mName = configDataEntries[i][0];

    if (!imports) {
      errors.push(`CONFIG ERROR: Module "${mName}" dosn't have "imports" field.`)
    }
    else if (!Array.isArray(imports)) {
      errors.push(`CONFIG ERROR: "imports" field of module "${mName}" is not an array.`)
    }
    else {
      for (let k = 0; k < imports.length; k++) {
        if (!configData.modules[imports[k]]) {
          errors.push(`CONFIG ERROR: Module "${imports[k]}" doesn't exist. Check module "${mName}" imports.`);
        }
        else if (!configData.modules[imports[k]].exports.includes(mName)) {
          errors.push(`CONFIG ERROR: Module "${mName}" has an import for module "${imports[k]}" but this module's exports doesn't include module "${mName}".`)
        }
      }
    }

    if (!exports) {
      errors.push(`CONFIG ERROR: Module "${mName}" dosn't have "exports" field.`)
    }
    else if (!Array.isArray(exports)) {
      errors.push(`CONFIG ERROR: "exports" field of module "${mName}" is not an array.`)
    }
    else {
      for (let k = 0; k < exports.length; k++) {
        if (!configData.modules[exports[k]]) {
          errors.push(`CONFIG ERROR: Module "${exports[k]}" doesn't exist. Check module "${mName}" exports.`);
        }
        else if (!configData.modules[exports[k]].imports.includes(mName)) {
          errors.push(`CONFIG ERROR: Module "${mName}" has an export for module "${exports[k]}" but this module's imports doesn't include module "${mName}".`)
        }
      }
    }
  }

  if (errors.length) {
    errors.forEach((e) => console.log('\x1b[31m', e));
    process.exit(1);
  }
}

module.exports = {
  checkConfigFileForErrors
}