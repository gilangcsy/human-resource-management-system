module.exports = (sequelize, Sequelize) => {
    const Menu = sequelize.define('Menu', {
        name: {
            type: Sequelize.STRING
        },
        url: {
            type: Sequelize.STRING
        },
        icon: {
            type: Sequelize.STRING
        },
        position_number: {
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        master_menu: {
            type: Sequelize.INTEGER
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
        tableName: 'Menu'
    })
    return Menu;
}