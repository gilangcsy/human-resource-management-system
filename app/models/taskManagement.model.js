module.exports = (sequelize, Sequelize) => {
    const TaskManagement = sequelize.define('TaskManagement', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        start_date: {
            type: "TIMESTAMP",
            allowNull: false,
        },
        end_date: {
            type: "TIMESTAMP",
            allowNull: false,
        },
        assign_to: {
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
        owner_id: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        tableName: 'TaskManagement'
    })
    return TaskManagement;
}