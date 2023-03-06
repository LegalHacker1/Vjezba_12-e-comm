const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['jklqj43j432kj4k3j12j3k21n432n13k21kl3']
}));

app.get('/signup', (req, res) => {
    res.send(`
    <div>
        Your id is: ${req.session.userId}
        <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordComfirmation" placeholder="password comfirmation" />
        <button>Sign up</button>
        </form>
    </div>
    `);
});


app.post('/signup', async (req, res) => {
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

app.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out');
});

app.get('/signin', (req, res) => {
    res.send(`
    <div>
    <form method="POST">
    <input name="email" placeholder="email" />
    <input name="password" placeholder="password" />
    <button>Sign In</button>
    </form>
</div>
    `);
});

app.post('/signin', async (req, res) => {
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

app.listen(3000, () => {
    console.log('Listening');
});
