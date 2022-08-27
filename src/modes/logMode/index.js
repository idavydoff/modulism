const { getConfigData } = require('../../utils/getConfigData');
const { fireError } = require('../../utils/fireError');

const logMode = async () => {
  const configData = getConfigData();
  const modulesToLog = process.argv.slice(3);
  
  modulesToLog.forEach((mod) => {
    if (!configData.modules[mod]) 
      fireError(`CONFIG ERROR: Module "${mod}" doesn't exist.`);
  })

  const toLog = modulesToLog.length ? modulesToLog : Object.keys(configData.modules);

  toLog.forEach((mod, index) => {
    console.log('')
    console.log('\x1b[0m\x1b[7m', `Module: ${mod} \x1b[0m`);

    const imports = configData.modules[mod].imports;
    const exports = configData.modules[mod].exports;
  
    if (imports.length) {
      console.log('\x1b[0m\x1b[32m', 'Imports:');
      imports.forEach((mod) => console.log('\x1b[0m\x1b[37m', `  - ${mod}`))
    }
    if (exports.length) {
      console.log('\x1b[0m\x1b[33m', 'Exports To:');
      exports.forEach((mod) => console.log('\x1b[0m\x1b[37m', `  - ${mod}`))
    }

    if (!imports.length && !exports.length) {
      console.log('\x1b[0m\x1b[33m', `Module has no imports and no exports.`)
    }

    if (index === toLog.length - 1) console.log('')
  })
}

module.exports = logMode;