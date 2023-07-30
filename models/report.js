import db from "../database/init.js";
const options = {
    tableName: "reports",
    modelName: "reports",
    createdAt: true,
    updatedAt: true,
}

const Report = db.sequelize.define(
    "reports",
    {
        reportUUID: {
            type: db.Sequelize.UUID,
            defaultValue: db.Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        checkId: {
            type: db.Sequelize.UUID,
            allowNull: false,
            references: {
                model: "checks",
                key: "checkUUID",
            }
        },
        availability: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false,
            unique: false,
        },
        responseTime: {
            type: db.Sequelize.INTEGER(5),
            allowNull: true,
            unique: false,
            defaultValue: null
        },
        note: {
            type: db.Sequelize.STRING(50),
            allowNull: true,
            defaultValue: null
        }
    },
    options
);

// await Report.sync({ force: true });
export default Report;