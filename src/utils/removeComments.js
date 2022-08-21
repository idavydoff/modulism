// const removeCommentedLines = (str) => str.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'');
const removeComments = (jsonString) => jsonString.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);

module.exports = {
  removeComments
}
