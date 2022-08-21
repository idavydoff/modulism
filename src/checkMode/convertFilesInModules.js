const path = require('path');
const fs = require('fs');
const { getDirFiles } = require('../utils/getDirFiles');
const { sliceFileName } = require('../utils/sliceFileName');

const convertFilesInModules = async (
  filesInModules, 
  moduleLinksReverted, 
  paths,
  workDir,
  extensions
) => {
  const filesInModulesEntries = Object.entries(filesInModules)
  const moduleLinksRevertedEntries = Object.entries(moduleLinksReverted)
  const res = {};
  const modulesWithImports = {
    ...(Object.fromEntries(moduleLinksRevertedEntries.map((v) => [v[1], []])))
  };

  for (let i = 0; i < filesInModulesEntries.length; i++) {
    const imports = [];
    for (let k = 0; k < filesInModulesEntries[i][1].length; k++) {
      const importPath = filesInModulesEntries[i][1][k];
      let mpath
      let isProjectPath = false;
      if (importPath[0] === '.') {
        mpath = path.resolve(path.dirname(filesInModulesEntries[i][0]), importPath);
      }
      else {
        isProjectPath = true;

        let startsWithPart = null

        if (importPath.startsWith(workDir + '/')) {
          startsWithPart = [workDir, workDir]
        }
        else {
          const pathsEntries = Object.entries(paths);
          for (let j = 0; j < pathsEntries.length; j++) {
            if (importPath.startsWith(pathsEntries[j][0])) {
              startsWithPart = pathsEntries[j];
              break;
            }
          }
        }

        const newPathPart = startsWithPart ? `${startsWithPart[1]}${importPath.slice(startsWithPart[0].length)}` : importPath
        mpath = path.resolve(
          process.cwd(),
          newPathPart.startsWith(workDir) ? '' : workDir,
          newPathPart
        )

        const mpathFile = sliceFileName(mpath);
        
        if (!mpathFile.includes('.')) {
          if (fs.existsSync(mpath) && fs.lstatSync(mpath).isDirectory()) {
            const files = await getDirFiles(mpath)
            const indexFile = files.find((f) => f.startsWith(mpath + '/index.'))
            
            if (indexFile) {
              mpath += `/${sliceFileName(indexFile)}`
            }
          }
          else {
            for (let j = 0; j < extensions.length; j++) {
              if (fs.existsSync(mpath + '.' + extensions[j])) {
                mpath += `.${extensions[j]}`;
                break;
              }
            }
          }
        }
      }
      try {
        if (isProjectPath && !fs.existsSync(mpath)) continue;
        const findModule = moduleLinksRevertedEntries.find((m) => mpath.startsWith(m[0].slice(0, -1)))
        if (findModule)
          imports.push(findModule[1])
      }
      catch (e) {}
    }
    
    const filePath = filesInModulesEntries[i][0];
    const fileModule = moduleLinksRevertedEntries.find((m) => filePath.startsWith(m[0].slice(0, -1)));
    res[filesInModulesEntries[i][0]] = {
      module: fileModule[1] || null,
      imports,
    }
    if (fileModule[1])
      modulesWithImports[fileModule[1]] = Array.from(new Set([...(modulesWithImports[fileModule[1]] || []), ...imports]))
  }

  return {
    convertedFiles: res,
    modulesWithImports
  }
}

module.exports = {
  convertFilesInModules
}