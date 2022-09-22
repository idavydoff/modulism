const { correctImportPath } = require('./correctImportPath');

const convertFilesInModules = async (
  filesInModules, 
  moduleLinksReverted, 
  paths,
  workDir,
  modulesWithGroups,
  modulesGroups,
  files,
  extensions
) => {
  const filesInModulesEntries = Object.entries(filesInModules)
  const moduleLinksRevertedEntries = Object.entries(moduleLinksReverted)
  const res = {};
  const modulesWithImports = {
    ...(Object.fromEntries(moduleLinksRevertedEntries.map((v) => [v[1], []])))
  };

  for (let i = 0; i < filesInModulesEntries.length; i++) {
    const filePath = filesInModulesEntries[i][0];
    let imports = [];
    for (let k = 0; k < filesInModulesEntries[i][1].length; k++) {
      const importPath = filesInModulesEntries[i][1][k];
      const mpath = await correctImportPath(
        importPath, 
        filePath,
        workDir, 
        paths, 
        files,
        extensions
      );
      
      const findModule = moduleLinksRevertedEntries.find((m) => mpath.startsWith(m[0].slice(0, -1)));
      if (findModule) {
        let group = null;
        if (modulesWithGroups[findModule[1]]) {
          const findGroup = modulesWithGroups[findModule[1]]
            .find((g) => {
              return g[0] === '$' ? g.slice(1) === mpath : mpath.startsWith(g.slice(0, -1)); 
            });
          if (findGroup) {
            group = modulesGroups[findGroup].name
          }
          else {
            group = 'common'
          }
        }
        
        imports.push({
          module: findModule[1],
          group
        });
      }
    }

    const fileModule = moduleLinksRevertedEntries.find((m) => filePath.startsWith(m[0].slice(0, -1)));

    if (fileModule[1]) {
      imports = imports.filter((mod) => mod.module !== fileModule[1]);

      modulesWithImports[fileModule[1]] = 
        [...(modulesWithImports[fileModule[1]] || []), ...imports]
        .filter((mod) => mod.module !== fileModule[1])
        .filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.module === value.module && t.group === value.group
          ))
        );
    }

    res[filePath] = {
      module: fileModule[1] || null,
      imports,
    }
  }

  return {
    convertedFiles: res,
    modulesWithImports
  }
}

module.exports = {
  convertFilesInModules
}