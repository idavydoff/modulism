const { fireError } = require("../../utils/fireError");

const convertExports = (exports, modules, moduleName) => {
  const res = {};

  exports.forEach(exp => {
    if (!modules[exp]) 
      fireError(`ERROR: Module "${exp}" from module's "${moduleName}" exports doesn't exist.`)

    const imports = modules[exp].imports
      .filter((imp) => imp.startsWith(`${moduleName}:`))
      .map((imp) => imp.replace(`${moduleName}:`, ''))
    
    res[exp] = imports
  });

  return res;
}

module.exports = {
  convertExports
}
