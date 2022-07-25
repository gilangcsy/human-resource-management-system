module.exports = (sequelize, Sequelize) => {
    const PasswordReset = sequelize.define('PasswordReset', {
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        token: {
            type: Sequelize.STRING,
            allowNull: false
        },
        expiredDate: {
            type: "TIMESTAMP",
            allowNull: false
        },
        isUsed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        usedAt: {
            type: "TIMESTAMP"
        },
        createdAt: {
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
        },
    }, {
        updatedAt: false, // don't add updatedAt attribute
        tableName: 'PasswordReset'
    })
    return PasswordReset;
}