const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongo = require('mongodb');
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
                    });
                });
        })
        .catch(err => console.log(err));
};

module.exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: 'reset',
        errorMessage: req.flash('error')
    });
};

module.exports.postReset = (req, res, next) => {
    const email = req.body.email;

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('/reset');
        }

        const token = buffer.toString('hex');
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.')
                    return res.redirect('/reset');
                };

                user.resetToken = token;
                user.resetExpiration = Date.now() + (3600 * 1000); // one hour
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                return transporter.sendMail({
                    to: email,
                    from: 'info@orifjon.net',
                    subject: 'Password reset!',
                    html: `<h1>You requested a password reset</h1>
                    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to seat a new passord!</p>
                    `
                })
            })
    })
};

module.exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    console.log(token);
    User.findOne({ resetToken: token, resetExpiration: { $gt: Date.now() } })
        .then(user => {
            let errorMessage;
            let userId;

            if (!user) {
                req.flash('error', 'Invalid a token');
            } else {
                userId = user._id
            }

            res.render('auth/new-password', {
                pageTitle: 'Update Password',
                path: 'update-password',
                errorMessage: req.flash('error'),
                userId: userId,
                resetToken: token
            });
        })
        .catch(err => console.log(err));
};

module.exports.postUpdatePassword = (req, res, next) => {
    const { userId, password, token } = req.body;
    let resetUser;
    User.findOne({ resetToken: token, resetExpiration: { $gt: Date.now() } })
        .then(user => {
            if (user && user._id.toString() !== userId) {
                req.flash('error', 'Invalid a token or it was expired');
                return res.redirect(`/reset/${token}`);
            }
            resetUser = user;
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    resetUser.password = hashedPassword;
                    resetUser.resetToken = undefined;
                    resetUser.resetExpiration = undefined;

                    return resetUser.save();
                })
                .then(() => {
                    res.redirect('/login');
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