const { ObjectFromEntries } = require('../utils/ObjectFromEntries');
const { sliceFileName } = require('../utils/sliceFileName');

const getModulismModules = (modulismFiles, filesData) => {
  const modulismModuleFiles = modulismFiles.filter((f) => sliceFileName(f)[0] !== '.');
  const modulismGroupFiles = modulismFiles.filter((f) => sliceFileName(f)[0] === '.');

  const singleModulismGroupFiles = Object.entries(filesData).filter((f) => f[1].match(/\*modulism-group \w+/)).map((f) => {
    return [f[0], f[1].match(/\*modulism-group [^\s\\]+/)[0].split('*modulism-group ')[1]]
  })

  const modulesLinks = ObjectFromEntries(modulismModuleFiles.map((f) => {
    const name = sliceFileName(f);
    return [name.replace('.modulism', ''), f.replace(name, '')];
  }));
  const moduleLinksReverted = ObjectFromEntries(Object.entries(modulesLinks).map((m) => [m[1], m[0]]));

  const modulesWithGroups = {};

  const modulesGroups = ObjectFromEntries(modulismGroupFiles.map((f) => {
    const group = f.replace(sliceFileName(f), '');

    let module = null;
    for (let i = 0; i < modulismModuleFiles.length; i++) {
      const mName = sliceFileName(modulismModuleFiles[i]);

      if (f.includes(modulismModuleFiles[i].replace(mName, ''))) {
        module = mName.replace('.modulism', '');
        modulesWithGroups[module] = modulesWithGroups[module] ? [...modulesWithGroups[module], group] : [group]
      }
    }

    return [group, {
      name: sliceFileName(f).replace('.modulism', '').slice(1),
      module
    }]
  }))

  singleModulismGroupFiles.forEach(([file, group]) => {
    let module = null;
    for (let i = 0; i < modulismModuleFiles.length; i++) {
      const mName = sliceFileName(modulismModuleFiles[i]);

      if (file.includes(modulismModuleFiles[i].replace(mName, ''))) {
        const formattedFile = '$' + file;

        module = mName.replace('.modulism', '');
        modulesWithGroups[module] = modulesWithGroups[module] ? 
          [...modulesWithGroups[module], formattedFile] : 
          [formattedFile];
        modulesGroups[formattedFile] = {
          name: group,
          module
        }
      }
    }
  })

  return {
    modulesLinks,
    moduleLinksReverted,
    modulesWithGroups,
    modulesGroups
  }
}

module.exports = {
  getModulismModules
}