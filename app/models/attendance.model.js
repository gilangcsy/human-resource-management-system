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
        workLoadStatus: {
            type: Sequelize.STRING
        },
        planningActivity: {
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
        clockInPhoto: {
            type: Sequelize.STRING
        },
        clockOutPhoto: {
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
        },
        updatedBy: {
            type: Sequelize.STRING
        },
    }, {
        tableName: 'Attendance'
    })
    return Attendance;
}