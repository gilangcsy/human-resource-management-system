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
        created_at: {
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
        },
        created_by: {
            type: Sequelize.STRING
        },
        deleted_at: {
            type: "TIMESTAMP"
        },
        deleted_by: {
            type: Sequelize.STRING
        },
        updated_at: {
            type: "TIMESTAMP"
        },
        updated_by: {
            type: Sequelize.STRING
        },
    }, {
        createdAt: false,
        updatedAt: false, // don't add updatedAt attribute
        tableName: 'Role Menu'
    })
    return RoleMenu;
}