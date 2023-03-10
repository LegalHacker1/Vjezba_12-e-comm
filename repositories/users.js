const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class usersRepository extends Repository {

    async comparePasswords(saved, supplied) {
        // Saved -> passwords saved in our database. 'hashed.salt'
        // Supplied -> password given to us by a user trying to sing in
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuf.toString('hex');
    }

    async create(attrs) {
        // attrs === { email: '', password: '' }

        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);

        // { email: 'dssadsaf@gaasdsa.com', password: 'password' }

        const records = await this.getAll();
        const record = { 
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        };
        records.push(record);

        // write the updated 'records' array back to this.filename

        await this.writeAll(records); 
       
        return record;
    }
}

module.exports = new usersRepository('users.json');