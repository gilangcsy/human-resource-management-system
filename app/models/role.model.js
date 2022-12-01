module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        superior_id: {
            type: Sequelize.INTEGER
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
        tableName: 'Role'
    })
    return Role;
}