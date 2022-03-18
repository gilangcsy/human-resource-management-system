module.exports = (sequelize, Sequelize) => {
    const UserInvitation = sequelize.define('UserInvitation', {
        token: {
            type: Sequelize.TEXT,
            unique: true
        },
        expiredDate: {
            type: "TIMESTAMP",
            allowNull: false
        },
        isApproved: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        invitedBy: {
            type: Sequelize.STRING,
        },
        createdAt: {
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
        },
        deletedAt: {
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
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
        tableName: 'UserInvitation'
    })
    return UserInvitation;
}