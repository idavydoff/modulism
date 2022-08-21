const checkModulesForErrors = (configData, files, modules) => {
  const configDataEntries = Object.entries(configData);
  const filesEntries = Object.entries(files);

  const errors = [];

  for (let i = 0; i < filesEntries.length; i++) {
    const curFile = filesEntries[i];
    const { module, imports } = curFile[1];
    
    for (let k = 0; k < imports.length; k++) {
      if (!configData[module]) {
        errors.push(`ERROR: Module "${module}" doesn't exist in config.modulism.json file.`);
      }
      else if (!configData[module].imports.includes(imports[k])) {
        errors.push(`ERROR: File "${curFile[0]}" of module "${module}" is importing module "${imports[k]}". Module "${module}" doesn't importing module "${imports[k]}" in modulism config.`)
      }

      if (!configData[imports[k]]) {
        errors.push(`ERROR: Module "${imports[k]}" doesn't exist in config.modulism.json file.`);
      }
      else if (!configData[imports[k]].exports.includes(module)) {
        errors.push(`ERROR: File "${curFile[0]}" of module "${module}" is importing module "${imports[k]}". Module "${imports[k]}" doesn't exporting to module "${module}" in modulism config.`)
      }
    }
  }

  for (let i = 0; i < configDataEntries.length; i++) {
    const mName = configDataEntries[i][0];
    const { imports, exports } = configDataEntries[i][1];

    if (!modules[mName]) {
      errors.push(`ERROR: Module "${mName}" doesn't exist in code (modulism file not found or the module doesn't have ts|tsx|js|jsx files).`);
      continue;
    }

    for (let k = 0; k < imports.length; k++) {
      if (!modules[mName].includes(imports[k])) {
        errors.push(`ERROR: Module "${mName}" doesn't importing module "${imports[k]}" like it must.`)
      }
    }

    for (let k = 0; k < exports.length; k++) {
      if (!modules[exports[k]]) {
        errors.push(`ERROR: Module "${exports[k]}" doesn't exist in code.`);
      }
      else if (!modules[exports[k]].includes(mName)) {
        errors.push(`ERROR: Module "${mName}" doesn't exporting to module "${exports[k]}" like it must.`)
      }
    }
    
  }

  if (errors.length) {
    errors.forEach((e) => console.log('\x1b[31m', e));
    process.exit(1);
  }
}

module.exports = {
  checkModulesForErrors
}