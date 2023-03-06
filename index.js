const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./repositories/routes/admin/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['jklqj43j432kj4k3j12j3k21n432n13k21kl3']
}));

app.use(authRouter);

app.listen(3000, () => {
    console.log('Listening');
});
