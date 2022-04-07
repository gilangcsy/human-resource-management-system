module.exports = (sequelize, Sequelize) => {
    const ClaimType = sequelize.define('ClaimType', {
        name: {
            type: Sequelize.STRING
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
        tableName: 'ClaimType'
    })
    return ClaimType;
}