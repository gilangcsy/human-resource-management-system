module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        employee_id: {
            type: Sequelize.STRING
        },
        full_name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING
        },
        gender: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.TEXT,
        },
        avatar: {
            type: Sequelize.STRING,
            defaultValue: 'default.jpg'
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        isVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
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
            type: "TIMESTAMP",
        },
        updatedBy: {
            type: Sequelize.STRING
        },
    }, {
        tableName: 'User'
    })
    return User;
}