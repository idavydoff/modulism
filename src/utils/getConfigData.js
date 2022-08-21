const fs = require('fs');
const path = require('path');
const { removeComments } = require('./removeComments');

const getConfigData = () => {
  const filePath = path.resolve(process.cwd(), './config.modulism.json');
  try {
    if (!fs.existsSync(filePath)) {
      throw 'nf';
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const contentWithRemovedComments = removeComments(fileContent)
    const data = JSON.parse(contentWithRemovedComments);
    return data;
  }
  catch (e) {
    if (e === 'nf') {
      console.log('\x1b[31m', `ERROR: config.modulism.json file not found.`)
      process.exit(1);
    }
    console.log('\x1b[31m', `ERROR: failed to parse config.modulism.json file (probably the file is empty).`)
    process.exit(1);
  }
}

module.exports = {
  getConfigData
}
