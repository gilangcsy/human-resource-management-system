module.exports = (sequelize, Sequelize) => {
    const UserLog = sequelize.define('UserLog', {
        longitude: {
            type: Sequelize.TEXT
        },
        latitude: {
            type: Sequelize.TEXT
        },
        address: {
            type: Sequelize.TEXT
        },
        device: {
            type: Sequelize.STRING
        },
        detail: {
            type: Sequelize.TEXT
        },
        isLogin: {
            type: Sequelize.BOOLEAN
        },
        createdAt: {
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
        },
        createdBy: {
            type: Sequelize.STRING
        },
        deletedAt: {
            type: "TIMESTAMP"
        },
        deletedBy: {
            type: Sequelize.STRING
        },
        updatedAt: {
            type: "TIMESTAMP"
        },
        updatedBy: {
            type: Sequelize.STRING
        },
    }, {
        tableName: 'UserLog'
    })
    return UserLog;
}