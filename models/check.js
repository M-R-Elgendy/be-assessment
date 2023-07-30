import db from "../database/init.js";
const options = {
    tableName: "checks",
    modelName: "checks",
    createdAt: true,
    updatedAt: true,
}

const Check = db.sequelize.define(
    "checks",
    {
        checkUUID: {
            type: db.DataTypes.UUID,
            defaultValue: db.Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: db.DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "userUUID",
            }
        },
        name: {
            type: db.Sequelize.STRING(50),
            allowNull: false,
            unique: false,
        },
        domain: {
            type: db.Sequelize.STRING(150),
            allowNull: false,
            unique: false,
            validate: {
                isUrl: true
            }
        },
        protocol: {
            type: db.Sequelize.ENUM("HTTP", "HTTPS", "TCP"),
            allowNull: false,
            unique: false,
            validate: {
                is: /^(HTTP|HTTPS|TCP)$/i
            }
        },
        path: {
            type: db.Sequelize.STRING(100),
            allowNull: true,
            unique: false,
            defaultValue: null
        },
        port: {
            type: db.Sequelize.INTEGER,
            allowNull: true,
            unique: false,
            defaultValue: null,
            validate: {
                isNumeric: true
            }
        },
        webhook: {
            type: db.Sequelize.STRING(100),
            allowNull: true,
            unique: false,
            defaultValue: null,
            validate: {
                isUrl: true
            }
        },
        timeout: {
            type: db.Sequelize.INTEGER,
            allowNull: true,
            unique: false,
            defaultValue: 5,
            validate: {
                isNumeric: true
            }
        },
        interval: {
            type: db.Sequelize.INTEGER,
            allowNull: true,
            unique: false,
            defaultValue: 10,
            validate: {
                isNumeric: true
            }
        },
        threshold: {
            type: db.Sequelize.INTEGER,
            allowNull: true,
            unique: false,
            defaultValue: 1,
            validate: {
                isNumeric: true
            }
        },
        authUsername: {
            type: db.Sequelize.STRING(100),
            allowNull: true,
            unique: false,
            defaultValue: null
        },
        authPassword: {
            type: db.Sequelize.STRING(100),
            allowNull: true,
            unique: false,
            defaultValue: null
        },
        httpHeaders: {
            type: db.DataTypes.JSON,
            defaultValue: [],
            unique: false,
        },
        assert: {
            type: db.Sequelize.INTEGER,
            allowNull: true,
            unique: false,
            defaultValue: null,
            validate: {
                isNumeric: true
            }
        },
        tags: {
            type: db.Sequelize.STRING(100),
            allowNull: true,
            unique: false,
            defaultValue: null
        },
        ignoreSSL: {
            type: db.Sequelize.BOOLEAN,
            allowNull: true,
            unique: false,
            defaultValue: false
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['userId', 'domain', 'port', 'path', 'protocol']
            }
        ]
    },
    options
);

// await Check.sync({ force: true });
export default Check;