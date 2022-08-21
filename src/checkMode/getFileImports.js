const fs = require('fs');
const { combineRegExps } = require('../utils/combineRegExps');
const { parseES5Imports } = require('../utils/parseES5Imports');
const { parseES6Imports } = require('../utils/parseES6Imports');
const { parseLessCssImports } = require('../utils/parseLessCssImports');

const endsWithRegExp = (ext) => new RegExp(`\\.${ext}$`, 'g');

const getFileImports = (f) => new Promise((res, rej) => {
  const data = fs.readFileSync(f, "utf8");

  let imports = [];

  if (f.match(endsWithRegExp('less'))) {
    imports = [...parseLessCssImports(data)];
  }
  else if (f.match(combineRegExps(['js', 'jsx', 'ts', 'tsx'].map((ext) => endsWithRegExp(ext)), 'g'))) {
    const ES6Imports = parseES6Imports(data);
    const ES5Imports = parseES5Imports(data);

    imports = [...ES5Imports, ...ES6Imports];
  }
  else {
    console.log('\x1b[31m', `PARSE ERROR: Extension of file ${f} is not supported.`);
    process.exit(1);
  }

  res(imports)
})

module.exports = {
  getFileImports
};
