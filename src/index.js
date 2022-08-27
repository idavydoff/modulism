#!/usr/bin/env node
const checkMode = require('./modes/checkMode');
const createMode = require('./modes/createMode');
const deleteMode = require('./modes/deleteMode');
const editMode = require('./modes/editMode');
const initMode = require('./modes/initMode');
const renameMode = require('./modes/renameMode');
const syncMode = require('./modes/syncMode');
const logMode = require('./modes/logMode');
const { checkConfigFileForErrors } = require('./checkConfigFileForErrors');
const { removeConfigDuplicates } = require('./removeConfigDuplicates');
const { fireError } = require('./utils/fireError');

const main = () => {
  switch (process.argv[2]) {
    case 'check':
    case 'create':
    case 'edit':
    case 'rename':
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
      initMode();
      break;
    case 'rename':
      renameMode();
      break;
    case 'sync':
      syncMode();
      break;
    case 'log':
      logMode();
      break;
    default:
      fireError('ERROR: Unexpected argument')
  }
}  

main()