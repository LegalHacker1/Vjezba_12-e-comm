const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordComfirmation" placeholder="password comfirmation" />
        <button>Sign up</button>
        </form>
    </div>
    `);
});


app.post('/', async (req, res) => {
    const { email, password, passwordComfirmation} = req.body;

    const existingUser = await usersRepo.getOneBy({ email: email });
    if (existingUser) {
        return res.send('Email in use');
    }

    if (password !== passwordComfirmation) {
        return res.send('Passwords must match');
    }
    res.send('Account created!!!');
});

app.listen(3000, () => {
    console.log('Listening');
});
