const { removeComments } = require('./removeComments')

// @import "url"
const importsType1RegExp = new RegExp(/@\b(?:import)(?:\s+|\s*\(\s*)['"](?<path2>[^'"]+)['"]/gm)
// @import url("url")
const importsType2RegExp = new RegExp(/@(?:import)(?:\s+|\s*\(\s*)url[(]['"](?<path2>[^'"]+)['"][)]/gm)
// @import variable "url"
const importsType3RegExp = new RegExp(/@(?:import)(?:\s+|\s*\(\s*)\w+\s['"](?<path2>[^'"]+)['"]/gm)

const importsFilter = (imp) => {
  if (imp.includes("'")) 
      return imp.split("'")[1];
    return imp.split('"')[1];
} 

const parseLessCssImports = (str) => {
  const removedComments = removeComments(str);

  const imports1 = (removedComments.match(importsType1RegExp) || []).map(importsFilter)
  const imports2 = (removedComments.match(importsType2RegExp) || []).map(importsFilter)
  const imports3 = (removedComments.match(importsType3RegExp) || []).map(importsFilter)

  return [
    ...imports1,
    ...imports2,
    ...imports3
  ]
};

module.exports = {
  parseLessCssImports
}