module.exports = (sequelize, Sequelize) => {
    const Claim = sequelize.define('Claim', {
        claim_start_date: {
            type: "TIMESTAMP",
            allowNull: false,
        },
        claim_end_date: {
            type: "TIMESTAMP",
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING
        },
        attachment: {
            type: Sequelize.JSON
        },
        approval_one_status: {
            type: Sequelize.BOOLEAN
        },
        approval_two_status: {
            type: Sequelize.BOOLEAN
        },
        approval_three_status: {
            type: Sequelize.BOOLEAN
        },
        approval_one_date: {
            type: "TIMESTAMP",
        },
        approval_two_date: {
            type: "TIMESTAMP",
        },
        approval_three_date: {
            type: "TIMESTAMP",
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
        createdAt: false, // don't add createdAt attribute
        updatedAt: false, // don't add updatedAt attribute
        tableName: 'Claim'
    })
    return Claim;
}