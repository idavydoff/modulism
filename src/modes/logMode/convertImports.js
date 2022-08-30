const convertImports = (imports) => {
  const res = {};
  
  const withGroups = imports.filter((imp) => imp.includes(':'));
  const withoutGroups = imports.filter((imp) => !imp.includes(':'));

  withoutGroups.forEach(imp => {
    res[imp] = []
  });

  withGroups.forEach(imp => {
    const splitted = imp.split(':');
    res[splitted[0]] = res[splitted[0]] ? [...res[splitted[0]], splitted[1]] : [splitted[1]]
  })

  return res;
}

module.exports = {
  convertImports
}
