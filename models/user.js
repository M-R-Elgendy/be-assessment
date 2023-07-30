import db from "../database/init.js";
const options = {
    tableName: "users",
    modelName: "User",
    createdAt: true,
    updatedAt: true,
}

const User = db.sequelize.define("User",
    {
        userUUID: {
            type: db.DataTypes.UUID,
            defaultValue: db.Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: db.Sequelize.STRING(50),
            allowNull: false,
            unique: false
        },
        email: {
            type: db.Sequelize.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: db.Sequelize.STRING(100),
            allowNull: false,
            unique: false
        },
        isVerified: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        verificationCode: {
            type: db.Sequelize.INTEGER(6),
            allowNull: false,
            unique: true
        }
    },
    options
);

// await User.sync({ force: true });
export default User;