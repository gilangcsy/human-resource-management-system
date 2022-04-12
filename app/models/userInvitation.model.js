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
        tableName: 'UserInvitation'
    })
    return UserInvitation;
}