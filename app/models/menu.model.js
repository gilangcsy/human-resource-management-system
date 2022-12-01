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
        updatedAt: false,
        tableName: 'Menu'
    })
    return Menu;
}