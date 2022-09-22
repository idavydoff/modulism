const { getFileImports } = require('./getFileImports');

const getFilesWithImports = async (filesList, modulesLinks, filesData) => {
  const modulesLinksEntries = Object.entries(modulesLinks);

  const filesInModules = {}
  for (let i = 0; i < modulesLinksEntries.length; i++) {
    for (let k = 0; k < filesList.length; k++) {
      if (!filesInModules[filesList[k]] && filesList[k].includes(modulesLinksEntries[i][1])) {
        const fileImports = getFileImports(filesList[k], filesData[filesList[k]]);

        filesInModules[filesList[k]] = fileImports;
      }
      continue;
    }
  }

  return filesInModules;
}

module.exports = {
  getFilesWithImports
}
