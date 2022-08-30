const fs = require('fs');
const { JS_EXTENSIONS } = require('../constants');
const { combineRegExps } = require('../utils/combineRegExps');
const { fireError } = require('../utils/fireError');
const { parseES5Imports } = require('../utils/parseES5Imports');
const { parseES6Imports } = require('../utils/parseES6Imports');
const { parseLessCssImports } = require('../utils/parseLessCssImports');

const endsWithRegExp = (ext) => new RegExp(`\\.${ext}$`, 'g');

const getFileImports = (f, filesData) => {
  let imports = [];

  if (f.match(combineRegExps(['less', 'css'].map((ext) => endsWithRegExp(ext)), 'g'))) {
    imports = [...parseLessCssImports(filesData)];
  }
  else if (f.match(combineRegExps(JS_EXTENSIONS.map((ext) => endsWithRegExp(ext)), 'g'))) {
    const ES6Imports = parseES6Imports(filesData);
    const ES5Imports = parseES5Imports(filesData);

    imports = [...ES5Imports, ...ES6Imports];
  }
  else
    fireError(`PARSE ERROR: Extension of file ${f} is not supported.`);

  return imports;
}

module.exports = {
  getFileImports
};
