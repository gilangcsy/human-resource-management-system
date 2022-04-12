module.exports = (sequelize, Sequelize) => {
    const ApprovalTemplate = sequelize.define('ApprovalTemplate', {
        name: {
            type: Sequelize.STRING
        },
        approver_one: {
            type: Sequelize.INTEGER
        },
        approver_two: {
            type: Sequelize.INTEGER
        },
        approver_three: {
            type: Sequelize.INTEGER
        },
        type: {
            type: Sequelize.STRING
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
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
    },
    { 
        createdAt: false, // don't add createdAt attribute
        updatedAt: false,
        tableName: 'ApprovalTemplate'
    })
    return ApprovalTemplate;
}