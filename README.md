# Modulism
Library for keeping track of how modules depend on each other in your project. **Keeps information about what do module imports and where it exports itself in one place**.

[![npm version](https://img.shields.io/npm/v/modulism.svg?style=flat-square)](https://www.npmjs.com/package/modulism)

## Design goals
* Simplify working with modular architecture in the project.
* Put information about how modules depend on each other into one place.
* Make easier to detect unnecessary dependencies.

## How it works
It simply reads all files in your working directory and parse all of their imports. After that, it determines which file belongs to which module (You mark a module by putting <moduleName>.modulism file in it's root directory). And then, you can see all this information by running `modulism log` command in your console.

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
1. **All modulism cli commands must be fired from the root directory of your project.**
2. **All modules names must not contain any symbols except: latin characters, numbers, "_", "-". They also must not contain word "modulism".**
3. **All modules groups names must not contain any symbols except: latin characters, numbers, "_", "-". They also must not contain words "modulism" and "common".**

#### Supported file's list to parse imports from: 
* js
* jsx
* ts
* tsx
* mjs
* vue
* less
* css

### 1. Creating config file
To create your modulism config file run `modulism init`.

Set `workDir` property to your project working directory.
Example: `"workDir": "src"`

Set `extensions` property to file extensions that your project uses. **( Currently only available extensions are ts, js, less and css )**
Example: `"extensions": "ts, js, less"`

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

You can also split your modules by groups so the result data would be more informative for you. You can do it in two ways.
1. Determine group directory.
2. Determine group file.

To determine group directory just add `.<groupName>.modulism` file in your group directory.
To determine group file add `*modulism-group <groupName>` line in comments of your file.

**Example module:**
```
moduleEvents
    - constants
        ...
        .constants.modulism
    - logic
        ...
        .logic.modulism
    index.js
    moduleEvents.modulism
```

### 3. Generate modules dependencies config
Run `modulism sync`. 
It will update your config file with all data it got from parsing your project.

### 4. Log results
To check the information about your project's modules run `modulism log` in terminal. It will return all modules with their dependencies. If you want to check specific modules just write them like this `modulism log <module1> <module2>...`. 

**Example log result of a module:**
![Example](https://i.imgur.com/xABkyAJ.png)
##### - Blue dots are groups which are being imported to module.
##### - Purple dots are groups which module is exporting.

