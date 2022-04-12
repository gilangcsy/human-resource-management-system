module.exports = (sequelize, Sequelize) => {
    const LeaveType = sequelize.define('LeaveType', {
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
            type: "TIMESTAMP"
        },
        updatedBy: {
            type: Sequelize.STRING
        },
    }, {
        tableName: 'LeaveType'
    })
    return LeaveType;
}