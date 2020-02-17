const path = require('path');

module.exports = (...arg) => path.join(path.dirname(process.mainModule.filename), ...arg);