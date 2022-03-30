const db = require('../models/index.model');
const User = db.user;

checkIfUserExists = (req, res, next) => {
    let id = req.body.userId || req.params.id
    User.findOne({
        where: {
            id: id
        }
    }).then(user => {
        if (!user) {
            res.status(400).send({
                success: false,
                message: 'User not found.'
            });
            return;
        }
        next();
    });
};

const verifyUser = {
    checkIfUserExists: checkIfUserExists
};

module.exports = verifyUser;