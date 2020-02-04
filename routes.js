const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/message' && method === 'POST') {
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.appendFile('message.txt', message + '; ', err => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }

    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');

    if (req.url === '/') {
        res.write('<head><title>Message</title></head>')
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    } else {
        res.write('<head><title>My First Node.JS Server</title></head>')
        res.write('<body><h1>Welcome to my FIRST Node.js PAGE!</h1></body>');
    }
    res.write('</html>');
    res.end();
};

module.exports = requestHandler;

// All valid 

// module.exports = {
//     handler: requestHandler,
//     someText: 'Some text'
// };

// module.exports.handler = requestHandler;
// module.exports.someText = 'Some text';

// exports.handler = requestHandler;
// exports.someText = 'Some text';