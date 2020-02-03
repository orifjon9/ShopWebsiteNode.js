const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    // console.log(req.url, req.method, req.headers);
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
});


server.listen(3000, () => {
    console.log('http://localhost:3000 started');
})