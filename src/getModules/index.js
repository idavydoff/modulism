const { getDirFiles } = require('../utils/getDirFiles');
const { getFilesWithImports } = require('./getFilesWithImports');
const { convertFilesInModules } = require('./convertFilesInModules');
const { ObjectFromEntries } = require('../utils/ObjectFromEntries');

const getModules = async (path, extensions, paths, workDir) => {
  const { files, modulismFiles } = await getDirFiles(path, extensions);
  
  const modulesLinks = ObjectFromEntries(modulismFiles.map((f) => {
    const splitted = f.split('/');
    const name = splitted[splitted.length - 1];
    return [name.replace('.modulism', ''), f.replace(name, '')];
  }));
  const moduleLinksReverted = ObjectFromEntries(Object.entries(modulesLinks).map((m) => [m[1], m[0]]));

  const filesWithImports = await getFilesWithImports(files, modulesLinks);

  const { convertedFiles, modulesWithImports } = await convertFilesInModules(
    filesWithImports, 
    moduleLinksReverted, 
    paths, 
    workDir,
  );

  return {
    files: Object.fromEntries(Object.entries(convertedFiles).map(([n, f]) => [n, {
      ...f,
      imports: f.imports.filter((fi) => fi !== f.module)
    }])), 
    modules: modulesWithImports
  };
};

module.exports = getModules;