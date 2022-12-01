module.exports = (sequelize, Sequelize) => {
    const Attendance = sequelize.define('Attendance', {
        clockIn: {
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
        },
        clockOut: {
            type: "TIMESTAMP"
        },
        workload_status: {
            type: Sequelize.STRING
        },
        planning_activity: {
            type: Sequelize.STRING
        },
        location: {
            type: Sequelize.TEXT
        },
        longitude: {
            type: Sequelize.TEXT
        },
        latitude: {
            type: Sequelize.TEXT
        },
        clock_in_photo: {
            type: Sequelize.STRING
        },
        clock_out_photo: {
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
        tableName: 'Attendance'
    })
    return Attendance;
}