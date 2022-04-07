module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        employeeId: {
            type: Sequelize.STRING
        },
        fullName: {
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
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
        },
        updatedBy: {
            type: Sequelize.STRING
        },
    }, {
        tableName: 'User'
    })
    return User;
}