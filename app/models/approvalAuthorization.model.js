module.exports = (sequelize, Sequelize) => {
    const ApprovalAuthozitation = sequelize.define('ApprovalAuthozitation', {
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
        updatedAt: false, // don't add updatedAt attribute
        tableName: 'ApprovalAuthorization'
    })
    return ApprovalAuthozitation;
}