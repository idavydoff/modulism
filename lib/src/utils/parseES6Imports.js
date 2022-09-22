const { removeComments } = require('./removeComments')

const findES6ImportsRegExp = new RegExp(/(?:(?<=(?:import)[^`'"]*from\s+[`'"])(?<path1>[^`'"]+)(?=(?:'|"|`)))|(?:\b(?:import)(?:\s+|\s*\(\s*)[`'"](?<path2>[^`'"]+)[`'"])/gm);

const parseES6Imports = (str) => {
  const removedComments = removeComments(str);

  const imports = removedComments.match(findES6ImportsRegExp) || []

  return imports.map((i) => {
    if (i.includes("`")) 
      return i.split("`")[1]
    if (i.includes("'")) 
      return i.split("'")[1]
    if (i.includes('"')) 
      return i.split('"')[1]
    return i;
  });
};

module.exports = {
  parseES6Imports
}