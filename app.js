const express = require('express');
const bodyParser = require('body-parser');
const path = require('./util/path');

const app = express();

const adminRouters = require('./routes/admin');
const shopRouters = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path('public')));

app.use('/admin', adminRouters);
app.use(shopRouters);

app.use((req, res, next) => {
    res.status(404).sendFile(path('views', '404.html'));
})

app.listen(3000, () => {
    console.log('http://localhost:3000 started');
})