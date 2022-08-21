const path = require('path');
const fs = require('fs');
const { fireError } = require('../utils/fireError');
const { updateConfigFile } = require('../utils/updateConfigFile');

const initMode = () => {
  const configFilePath = path.resolve(process.cwd(), './config.modulism.json');
  if (fs.existsSync(configFilePath)) {
    fireError('ERROR: Config file already exists!')
  }

  const initState = {
    workDir: "src",
    extensions: "ts, js",
    modules: {}
  }
  updateConfigFile(initState)

  console.log('\x1b[32m', "Modulism config created!")
}

module.exports = initMode;