#!/usr/bin/env node
const checkMode = require('./checkMode');
const createMode = require('./createMode');
const deleteMode = require('./deleteMode');
const editMode = require('./editMode');
const initMode = require('./initMode');
const { checkConfigFileForErrors } = require('./checkConfigFileForErrors');
const { removeConfigDuplicates } = require('./removeConfigDuplicates');
const { fireError } = require('./utils/fireError');

const main = () => {
  switch (process.argv[2]) {
    case 'check':
    case 'create':
    case 'edit':
    case 'delete':
      checkConfigFileForErrors();
      removeConfigDuplicates();
      break;
  }

  switch (process.argv[2]) {
    case 'check':
      checkMode();
      break;
    case 'create':
      createMode();
      break;
    case 'edit':
      editMode();
      break;
    case 'delete':
      deleteMode();
      break;
    case 'init':
      initMode()
      break;
    default:
      fireError('ERROR: Unexpected argument')
  }
}  

main()