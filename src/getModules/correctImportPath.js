const path = require('path');
const fs = require('fs');

const { JS_EXTENSIONS, STYLE_EXTENSIONS } = require('../constants');
const { sliceFileName } = require('../utils/sliceFileName');
const { sliceFileExtension } = require('../utils/sliceFileExtension');

const getFileOfImportPath = (modulePath, files, filePath) => new Promise((res) => {
  let mpath = modulePath;
  const filePathExtension = sliceFileExtension(sliceFileName(filePath));
  if (fs.existsSync(mpath)) {
    fs.stat(mpath, (err, stat) => {
      if (stat && stat.isDirectory()) {
        const indexFilesOfDir = files.filter((f) => {
          const sliced = sliceFileName(f).split('.').slice(0, -1).join('');
          return f.startsWith(mpath) && sliced === 'index';
        });

        if (indexFilesOfDir.length) {
          let neededIndexFile = indexFilesOfDir[0];
          
          if (JS_EXTENSIONS.includes(filePathExtension)) {
            neededIndexFile = indexFilesOfDir.find((f) => JS_EXTENSIONS.includes(sliceFileExtension(sliceFileName(f))))
          }
          else if (STYLE_EXTENSIONS.includes(filePathExtension)) {
            neededIndexFile = indexFilesOfDir.find((f) => STYLE_EXTENSIONS.includes(sliceFileExtension(sliceFileName(f))))
          }
          mpath = mpath + '/' + sliceFileName(neededIndexFile);
        }

        res(mpath);
      }
      else {
        res(mpath)
      }
    });
  }
  else {
    const filesOfDir = files.filter((f) => f.startsWith(mpath));
    let neededFile = filesOfDir[0];

    if (filesOfDir.length) {
      let neededFile = filesOfDir[0];
      
      if (JS_EXTENSIONS.includes(filePathExtension)) {
        neededFile = filesOfDir.find((f) => JS_EXTENSIONS.includes(sliceFileExtension(sliceFileName(f))))
      }
      else if (STYLE_EXTENSIONS.includes(filePathExtension)) {
        neededFile = filesOfDir.find((f) => STYLE_EXTENSIONS.includes(sliceFileExtension(sliceFileName(f))))
      }
      mpath = mpath + '.' + sliceFileExtension(sliceFileName(neededFile));
    }

    res(mpath)
  }
})

const correctImportPath = async (
  importPath, 
  filePath, 
  workDir, 
  paths, 
  files, 
  extensions
) => {
  let mpath;
  if (importPath[0] === '.') {
    mpath = path.resolve(path.dirname(filePath), importPath);
  }
  else {
    let startsWithPart = null;

    if (importPath.startsWith(workDir + '/')) {
      startsWithPart = [workDir, workDir];
    }
    else {
      const pathsEntries = Object.entries(paths);
      for (let j = 0; j < pathsEntries.length; j++) {
        if (importPath.startsWith(pathsEntries[j][0])) {
          startsWithPart = pathsEntries[j];
          break;
        }
      }
    }

    const newPathPart = startsWithPart ? `${startsWithPart[1]}${importPath.slice(startsWithPart[0].length)}` : importPath;
    mpath = path.resolve(
      process.cwd(),
      newPathPart.startsWith(workDir) ? '' : workDir,
      newPathPart
    );
  }
    
  mpath = await getFileOfImportPath(mpath, files, filePath);

  return mpath;
}

module.exports = {
  correctImportPath,
}
