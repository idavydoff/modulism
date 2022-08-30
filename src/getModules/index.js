const { getDirFiles } = require('../utils/getDirFiles');
const { getFilesWithImports } = require('./getFilesWithImports');
const { convertFilesInModules } = require('./convertFilesInModules');
const { getModulismModules } = require('./getModulismModules');
const { ObjectFromEntries } = require('../utils/ObjectFromEntries');

const getModules = async (path, extensions, paths, workDir) => {
  const { files, modulismFiles, filesData } = await getDirFiles(path, extensions);

  const { 
    modulesLinks,
    moduleLinksReverted,
    modulesWithGroups,
    modulesGroups
  } = getModulismModules(modulismFiles, filesData);

  const filesWithImports = await getFilesWithImports(files, modulesLinks, filesData);

  const { convertedFiles, modulesWithImports } = await convertFilesInModules(
    filesWithImports, 
    moduleLinksReverted, 
    paths, 
    workDir,
    modulesWithGroups,
    modulesGroups,
    files,
    extensions
  );

  return {
    files: convertedFiles,
    modules: modulesWithImports,
    moduleGroups: ObjectFromEntries(Object.entries(modulesWithGroups).map(([mod, groups]) => {
      return [
        mod,
        groups.map(gr => ({
          name: modulesGroups[gr].name,
          url: gr[0] === '$' ? gr.slice(1) : gr 
        }))
      ]
    }))
  };
};

module.exports = getModules;