const fs = require("fs");
const path = require("path");
const { combineRegExps } = require('./combineRegExps');

const regExpTemplate = (ext) => new RegExp(`^(?!.*\\.d\.tsx?$).*\\.${ext}$`, 'g');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);

    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);

      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });

    });
  });
};

const getFilesList = (dir) => new Promise((res, rej) => {
  walk(dir, (err, results) => {
    if (err) res([]);
    res(results);
  });
})

const getDirFiles = async (path, extensions) => {
  const filesList = await getFilesList(path);
    
  const filteredFilesList = filesList
    .filter((f) => f.match(
      combineRegExps(extensions.map((ext) => regExpTemplate(ext)), 'g')
    ));
  const modulismFiles = filesList.filter((f) => f.includes('.modulism') && !f.includes('config.modulism.json'));

  return {
    files: filteredFilesList,
    modulismFiles,
  }
}


module.exports = {
  getDirFiles
}