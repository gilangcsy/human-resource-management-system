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
        expired_date: {
            type: "TIMESTAMP",
            allowNull: false
        },
        is_used: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        used_at: {
            type: "TIMESTAMP"
        },
        created_at: {
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
        },
    }, {
        createdAt: false,
        updatedAt: false, // don't add updatedAt attribute
        tableName: 'PasswordReset'
    })
    return PasswordReset;
}