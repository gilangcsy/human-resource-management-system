module.exports = (sequelize, Sequelize) => {
    const ClaimType = sequelize.define('ClaimType', {
        name: {
            type: Sequelize.STRING
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
            type: "TIMESTAMP",
        },
        updated_by: {
            type: Sequelize.STRING
        },
    }, {
        createdAt: false, // don't add createdAt attribute
        updatedAt: false,
        tableName: 'ClaimType'
    })
    return ClaimType;
}