# Modulism
Library for keeping track of how modules depend on each other in your project. **Keeps information about what do module imports and where it exports itself in one file**.

[![npm version](https://img.shields.io/npm/v/modulism.svg?style=flat-square)](https://www.npmjs.com/package/modulism)

## Design goals
* Simplify working with modular architecture in the project.
* Put information about how modules depend on each other into one file.

## How it works
It simply reads all files in your working directory and parse all of their imports. After that, it determines which file belongs to which module (You mark a module by putting <moduleName>.modulism file in it's root directory). And then, it starts to check whether the imports and exports of modules obtained after analyzing the project files match the information from the modulism.config.json file.

**- config.modulism.json file example**
```
{
  "workDir": "src",
  "extensions": "ts, js",
  "modules": {
    "one": {
      "imports": [ "two" ],
      "exports": []
    },
    "two": {
      "imports": [],
      "exports": [ "one" ]
    }
  }
}
```
**- project file system example**
```
- project
    - src
        - one
            index.js
            one.modulism (empty file)
        - two
            index.js
            two.modulism (empty file)
    config.modulism.json
    package.json
```

## Installation
```
npm i -g modulism // For local development
npm i modulism // For production pre build check 
```
```
// package.json
...
scripts": {
    "test:modulism": "modulism check"
},
...
```

## Getting started
**All modulism cli commands must be fired from the root directory of your project.**

### 1. Creating config file
To create your modulism config file run `modulism init`.

Set `workDir` property to your project working directory.
Example: `"workDir": "src"`

Set `extensions` property to file extensions that your project uses. **( Currently only available extensions are ts, js, less and css )**
Example: `"extensions": "ts, js, less",`

**[Optional]** Set `paths` property to import path vatiables you use in your project.
Example: 
In your project - `import utils from '@common/utils'`
`@common/` is actually `commonMod` dir in your project's root directory. 
Your modulism `paths` property:
```
...
"paths": {
    "@common": "commonMod/"
},
...
```

### 2. Create modules
Module is a folder with isolated code in it. Add an empty `<moduleName>.modulism` file in root directory of your module.

After that run `modulism create moduleName` command in command line. You will see that your config file has been updated.

### 3. Set up modules imports
For every module you created you should set what other modules it uses. Do it by running command `modulism edit <targetModule> import <moduleThatWasImported>`.

**For example.** If you have module "events" that uses functions from module "globalUtils" run `modulism edit events import globalUtils`.

**- events module file example**
```
...
import { someUtil } from 'globalUtils/common'
...
```

### 3. Run
Run modulism check command to validate your project modules imports. `modulism check`