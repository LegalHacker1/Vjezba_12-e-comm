const express = require('express');
const { check } = require('express-validator');

const usersRepo = require('../../../repositories/users');
const signupTemplete = require('../../../views/admin/auth/signup');
const signinTemplete = require('../../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplete({ req }));
});


router.post('/signup', [
    check('email'),
    check('password'),
    check('passwordComfirmation')
], async (req, res) => {
    const { email, password, passwordComfirmation} = req.body;

    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email in use');
    }

    if (password !== passwordComfirmation) {
        return res.send('Passwords must match');
    }

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
    res.send(signinTemplete());
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });

    if (!user) {
        return res.send('Email not found');
    }

    const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
    );
    if (!validPassword) {
        return res.send('Invalid password');
    }

    req.session.userId = user.id;

    res.send('You are signed in!!!!');
});

module.exports = router;