const path = require('path');
const { getConfigData } = require('../../utils/getConfigData');
const { fireError } = require('../../utils/fireError');
const { convertImports } = require('./convertImports');
const { convertExports } = require('./convertExports');

const logMode = async () => {
  const configData = getConfigData();
  const modulesToLog = process.argv.slice(3);
  
  modulesToLog.forEach((mod) => {
    if (!configData.modules[mod]) 
      fireError(`CONFIG ERROR: Module "${mod}" doesn't exist.`);
  })

  const toLog = modulesToLog.length ? modulesToLog : Object.keys(configData.modules);

  if (!toLog.length)
    fireError('ERROR: No modules to log.')

  toLog.forEach((mod, index) => {
    console.log('')
    console.log('\x1b[0m\x1b[7m', `Module: ${mod} \x1b[0m`);

    const { imports, exports, groups } = configData.modules[mod];

    if (imports.length) {
      console.log('\x1b[0m\x1b[32m', 'Imports:');
      const convertedImports = convertImports(imports);
      
      Object.entries(convertedImports).forEach((imp) => {
        console.log('\x1b[0m\x1b[37m', `  - ${imp[0]}`)
        imp[1].forEach((impG) => console.log('\x1b[0m\x1b[37m', `    \x1b[34m*\x1b[0m\x1b[37m ${impG}`))
      })
    }
    if (exports.length) {
      console.log('\x1b[0m\x1b[33m', 'Exports To:');
      const convertedExports = convertExports(exports, configData.modules, mod);

      Object.entries(convertedExports).forEach((exp) => {
        console.log('\x1b[0m\x1b[37m', `  - ${exp[0]}`)
        exp[1].forEach((expG) => console.log('\x1b[0m\x1b[37m', `    \x1b[35m*\x1b[0m\x1b[37m ${expG}`));
      })
    }
    if (groups && groups.length && modulesToLog.length) {
      console.log('\x1b[0m\x1b[36m', 'Groups:');
      groups.forEach((gr) => {
        console.log('\x1b[0m\x1b[37m', `  \x1b[36m-\x1b[0m\x1b[37m ${gr.name}`)
        console.log('\x1b[0m\x1b[37m', `    \x1b[36m-\x1b[0m\x1b[37m ${gr.url}`)
      })
    }

    if (!imports.length && !exports.length) {
      console.log('\x1b[0m\x1b[33m', `Module has no imports and no exports.`)
    }

    if (index === toLog.length - 1) console.log('')
  })
}

module.exports = logMode;