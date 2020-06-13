const fs = require('fs');

exports.delete = (filePath) => {
    return new Promise((res, rej) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                rej(err);
            } else {
                res(true);
            }
        })
    })
};