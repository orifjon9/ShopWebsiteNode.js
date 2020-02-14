const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('In middleware!');
    next();
});

app.use((req, res, next) => {
    console.log('In another middleware!');
    next();
});

app.use('/products', (req, res, next) => {
    res.send('<h1>Products page</h1>')
});

app.use('/', (req, res, next) => {
    res.send('<h1>Hello from Express!</h1>')
});


app.listen(3000, () => {
    console.log('http://localhost:3000 started');
})