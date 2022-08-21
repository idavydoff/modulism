const { getDirFiles } = require('../utils/getDirFiles');
const { getModulesData } = require('./getModulesData');
const { convertFilesInModules } = require('./convertFilesInModules');
const { ObjectFromEntries } = require('../utils/ObjectFromEntries');
const { combineRegExps } = require('../utils/combineRegExps');

const regExpTemplate = (ext) => new RegExp(`^(?!.*\\.d\.tsx?$).*\\.${ext}$`, 'g');

const getModules = async (path, extensions, paths, workDir) => {
  const filesList = await getDirFiles(path);
  
  const filteredFilesList = filesList
    .filter((f) => f.match(
      combineRegExps(extensions.map((ext) => regExpTemplate(ext)), 'g')
    ));
  const modulismFiles = filesList.filter((f) => f.includes('.modulism') && !f.includes('config.modulism.json'));
  
  const modulesLinks = ObjectFromEntries(modulismFiles.map((f) => {
    const splitted = f.split('/');
    const name = splitted[splitted.length - 1];
    return [name.replace('.modulism', ''), f.replace(name, '')];
  }));
  const moduleLinksReverted = ObjectFromEntries(Object.entries(modulesLinks).map((m) => [m[1], m[0]]));

  const { filesInModules } = await getModulesData(filteredFilesList, modulesLinks);
  const { convertedFiles, modulesWithImports } = await convertFilesInModules(
    filesInModules, 
    moduleLinksReverted, 
    paths, 
    workDir,
    extensions
  );

  return {
    files: Object.fromEntries(Object.entries(convertedFiles).map(([n, f]) => [n, {
      ...f,
      imports: f.imports.filter((fi) => fi !== f.module)
    }])), 
    modules: modulesWithImports
  };
};

module.exports = {
  getModules
}