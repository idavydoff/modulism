const combineRegExps = (regExpx, mode) => {
  let res = '';
  for (let i = 0; i < regExpx.length; i++) {
    res += regExpx[i].source + (i !== regExpx.length - 1 ? '|': '')
  }

  return new RegExp(res, mode);
}

module.exports = {
  combineRegExps,
}