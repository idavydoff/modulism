const fireError = (err) => {
  console.log('\x1b[31m', err);
  process.exit(1);
}

module.exports = { 
  fireError
}
