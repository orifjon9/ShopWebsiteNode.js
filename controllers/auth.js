const bcrypt = require('bcryptjs');

const User = require('../models/mongodb/user');

module.exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: 'login',
        isAuthenticated: false
    })
};

module.exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: 'signup',
        isAuthenticated: false
    })
};


module.exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    let fetchedUser;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                res.redirect('/login');
            }
            fetchedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(success => {
            console.log(success);
            if (success === false) {
                return res.redirect('/login');
            }

            return registerUserInSession(req, res, fetchedUser);
        })
        .catch(err => console.log(err));
};

module.exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};

module.exports.postSignup = (req, res, next) => {
    const { username, email, password } = req.body;
    User.findOne({ email: email })
        .then(exsitingUser => {
            if (exsitingUser) {
                req.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashPassword => {
                    return User.create({
                        email: email,
                        password: hashPassword,
                        username: username,
                        cart: {
                            items: []
                        }
                    });
                })
                .then(user => {
                    return registerUserInSession(req, res, user);
                });
        })
        .catch(err => console.log(err));
};

const registerUserInSession = (req, res, user) => {
    req.session.user = user;
    req.session.isLoggedIn = true;
    return req.session.save(() => {
        res.redirect('/');
    });
}