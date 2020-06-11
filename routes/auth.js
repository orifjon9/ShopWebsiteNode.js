const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/mongodb/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);

router.post('/login', [
    check('email')
        .isEmail()
        .withMessage('Please, enter a valid email.'),
    check('password', 'Please, enter a password with only numbers and text and at least 5 characters')
        .isLength({ min: 5 })
        .isAlphanumeric()
],
    authController.postLogin);
router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please, enter a valid email.')
            .custom((value, { req }) => {
                // if (value === 'bad@email.com') {
                //     throw Error('This email forbidden. Please, use a different.')
                // }
                // // success
                // return true;
                console.log(value);
                // Async validation
                return User.findOne({ email: value })
                    .then(exsitingUser => {
                        if (exsitingUser) {
                            console.log(exsitingUser);
                            return Promise.reject("E-mail exists already. Please, pick a different one!");
                        }

                        return Promise.resolve(true);
                    });
            }),
        body('password', 'Please, enter a password with only numbers and text and at least 5 characters')
            .isLength({ min: 5 })
            .isAlphanumeric(),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords mush be match');
                }
                return true;
            })
    ], authController.postSignup);
router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);

router.post('/update-password', authController.postUpdatePassword);

module.exports = router;