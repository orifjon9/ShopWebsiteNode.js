const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/mongodb/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: ""
    }
}));

module.exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: 'login',
        isAuthenticated: false,
        errorMessage: req.flash('error')
    })
};

module.exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: 'signup',
        isAuthenticated: false,
        errorMessage: req.flash('error')
    })
};


module.exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    let fetchedUser;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', "Invalid email or email doesn't exist");
                return res.redirect('/login');
            }
            fetchedUser = user;
            return bcrypt.compare(password, user.password)
                .then(success => {
                    if (success === false) {
                        req.flash('error', "Password didn't match");
                        return res.redirect('/login');
                    }

                    return registerUserInSession(req, res, fetchedUser);
                })
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
                req.flash('error', "E-mail exists already. Please, pick a different one.");
                return res.redirect('/signup');
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
                })
                .then(() => {
                    return transporter.sendMail({
                        to: email,
                        from: 'info@orifjon.net',
                        subject: 'Signup succeeded!',
                        html: '<h1>You successully signed up!</h1>'
                    })
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