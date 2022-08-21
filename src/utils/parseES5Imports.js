const { removeComments } = require('./removeComments')

const findES5ImportsRegExp = new RegExp(/(?:\b(?:require)(?:\s+|\s*\(\s*)[`'"](?<path2>[^`'"]+)[`'"])/gm);

const parseES5Imports = (str) => {
  const removedComments = removeComments(str);

  const imports = removedComments.match(findES5ImportsRegExp) || [];

  return imports
    .map((i) => i.slice(8)
    .replaceAll("`", '')
    .replaceAll("'", '')
    .replaceAll('"', ''));
};

module.exports = {
  parseES5Imports
};
