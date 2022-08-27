const fireError = (err, withoutExit) => {
  console.log('\x1b[31m', err);
  if (!withoutExit) process.exit(1);
}

module.exports = { 
  fireError
}
