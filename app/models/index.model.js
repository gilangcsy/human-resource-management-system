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
    debug:  false,
    dateStrings: 'date'
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Memanggil model-model yang sudah dibuat
db.user = require('./user.model')(sequelize, Sequelize)
db.userInvitation = require('./userInvitation.model')(sequelize, Sequelize)
db.userLog = require('./userLog.model')(sequelize, Sequelize)
db.attendance = require('./attendance.model')(sequelize, Sequelize)
db.leaveType = require('./leaveType.model')(sequelize, Sequelize)
db.claimType = require('./claimType.model')(sequelize, Sequelize)
db.approvalTemplate = require('./approvalTemplate.model')(sequelize, Sequelize)
db.approvalAuthorization = require('./approvalAuthorization.model')(sequelize, Sequelize)
db.leave = require('./leave.model')(sequelize, Sequelize)
db.claim = require('./claim.model')(sequelize, Sequelize)
db.role = require('./role.model')(sequelize, Sequelize)
db.menu = require('./menu.model')(sequelize, Sequelize)
db.roleMenu = require('./roleMenu.model')(sequelize, Sequelize)
db.passwordReset = require('./passwordReset.model')(sequelize, Sequelize)

db.user.hasMany(db.userInvitation)
db.userInvitation.belongsTo(db.user)

db.user.hasMany(db.userLog)
db.userLog.belongsTo(db.user)

db.role.hasMany(db.user)
db.user.belongsTo(db.role)

db.user.hasMany(db.attendance)
db.attendance.belongsTo(db.user)

db.approvalTemplate.hasMany(db.approvalAuthorization)
db.approvalAuthorization.belongsTo(db.approvalTemplate)

db.role.hasMany(db.approvalAuthorization, { foreignKey: 'RoleId' })
db.approvalAuthorization.belongsTo(db.role, { foreignKey: 'RoleId' })

db.user.hasMany(db.leave)
db.leave.belongsTo(db.user)

db.leaveType.hasMany(db.leave)
db.leave.belongsTo(db.leaveType)

db.role.hasMany(db.roleMenu)
db.roleMenu.belongsTo(db.role)

db.menu.hasMany(db.roleMenu)
db.roleMenu.belongsTo(db.menu)

db.user.hasMany(db.claim)
db.claim.belongsTo(db.user)

db.claimType.hasMany(db.claim)
db.claim.belongsTo(db.claimType)

module.exports = db;