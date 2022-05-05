module.exports = (sequelize, Sequelize) => {
    const RoleMenu = sequelize.define('RoleMenu', {
        allow_create: {
            type: Sequelize.BOOLEAN
        },
        allow_read: {
            type: Sequelize.BOOLEAN
        },
        allow_update: {
            type: Sequelize.BOOLEAN
        },
        allow_delete: {
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
        tableName: 'Role Menu'
    })
    return RoleMenu;
}