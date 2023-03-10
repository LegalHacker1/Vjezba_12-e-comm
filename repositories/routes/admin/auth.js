const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../../repositories/users');
const signupTemplete = require('../../../views/admin/auth/signup');
const signinTemplete = require('../../../views/admin/auth/signin');
const {
    requireEmail,
    requirePassword,
    requirePasswordComfirmation,
    requireEmailExists,
    requireValidPasswordForUser
      } = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplete({ req }));
});


router.post('/signup', [
    requireEmail,
    requirePassword,
    requirePasswordComfirmation,

], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.send(signupTemplete({ req, errors }));
    }

    const { email, password, passwordComfirmation} = req.body;


    // Create a user in our user repo to represident this person
    const user = await usersRepo.create({ email, password });

    // Store the id of that user inside the user cookie
    req.session.userId = user.id;

    res.send('Account created!!!');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplete({}));
});

router.post('/signin', [
    requireEmailExists,
    requireValidPasswordForUser
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.send(signinTemplete({ errors }));
    }

    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.send('You are signed in!!!!');
});

module.exports = router;