const User = require('../models/mongodb/user');

module.exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: 'login',
        isAuthenticated: false
    })
};

module.exports.postLogin = (req, res, next) => {
    User.findOne()
        .then(user => {
            if (!user) {
                return User.create({
                    username: 'Orifjon',
                    email: 'info@orifjon.net',
                    cart: {
                        items: []
                    }
                })
                    .then(createdUser => {
                        return createdUser;
                    });
            }

            return user;
        })
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save(err => {
                console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => console.log(err));


};

module.exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};