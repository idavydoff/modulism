function ObjectFromEntries (iterable) {
  return [...iterable].reduce((obj, [key, val]) => {
    obj[key] = val
    return obj
  }, {})
}

module.exports = {
  ObjectFromEntries
}