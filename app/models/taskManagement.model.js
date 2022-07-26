module.exports = (sequelize, Sequelize) => {
    const TaskManagement = sequelize.define('TaskManagement', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        startDate: {
            type: "TIMESTAMP",
            allowNull: false,
        },
        endDate: {
            type: "TIMESTAMP",
            allowNull: false,
        },
        assignTo: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        priority: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ownerId: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        tableName: 'TaskManagement'
    })
    return TaskManagement;
}