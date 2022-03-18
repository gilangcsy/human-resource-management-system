//Memanggil data-data kongigurasi database
const dbConfig = require('../configs/db.config');


const Sequelize = require('sequelize');

//Konifgurasi database
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: false,
    timezone: dbConfig.timezone,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // }
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Memanggil model-model yang sudah dibuat
db.user = require('./user.model')(sequelize, Sequelize);
db.userInvitation = require('./userInvitation.model')(sequelize, Sequelize);
db.userLog = require('./userLog.model')(sequelize, Sequelize);

db.user.hasMany(db.userInvitation);
db.userInvitation.belongsTo(db.user);

db.user.hasMany(db.userLog);
db.userLog.belongsTo(db.user);


module.exports = db;