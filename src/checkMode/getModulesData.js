const { getFileImports } = require('./getFileImports');
const { ObjectFromEntries } = require('../utils/ObjectFromEntries');

const getModulesData = async (filesList, modulesLinks) => {
  const modulesLinksEntries = Object.entries(modulesLinks);
  const res = ObjectFromEntries(modulesLinksEntries.map((m) => [m[0], {
    link: m[1],
    files: []
  }]));
  const filesInModules = {}
  const filesLinkedToModules = {}
  for (let i = 0; i < modulesLinksEntries.length; i++) {
    for (let k = 0; k < filesList.length; k++) {
      if (!filesInModules[filesList[k]] && filesList[k].includes(modulesLinksEntries[i][1])) {
        const fileImports = await getFileImports(filesList[k]);

        filesInModules[filesList[k]] = fileImports;

        res[modulesLinksEntries[i][0]].files.push(filesList[k])
        filesLinkedToModules[filesList[k]] = modulesLinksEntries[i][0]
      }
      continue;
    }
  }
  return {
    modulesWithFiles: res,
    filesInModules,
    filesLinkedToModules,
  }
}

module.exports = {
  getModulesData
}
