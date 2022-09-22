const clearModulesFromGroups = (list) => Array.from(new Set(list.map((item) => item.includes(':') ? item.split(':')[0] : item)));

module.exports = {
  clearModulesFromGroups,
}
