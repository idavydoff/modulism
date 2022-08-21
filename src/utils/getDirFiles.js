const fs = require("fs");
const path = require("path");

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

const getDirFiles = (dir) => new Promise((res, rej) => {
  walk(dir, (err, results) => {
    if (err) res([]);
    res(results);
  });
})

module.exports = {
  getDirFiles
}