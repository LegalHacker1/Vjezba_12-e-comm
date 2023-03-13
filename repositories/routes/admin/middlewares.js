const { validationResult } = require('express-validator');

module.exports = {
    handleErrors(templeteFunc) {
        return (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.send(templeteFunc({ errors }));
            }

            next();
        };
    }
};