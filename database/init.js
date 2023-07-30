import { Sequelize, DataTypes } from 'sequelize';
import configurations from '../config/config.js'

const db = {};
const { name, username, password } = configurations.database;
const config = {
    host: configurations.database.host,
    port: configurations.database.port,
    logging: configurations.database.logging,
    pool: configurations.database.pool,
    dialect: 'mysql'
}

const databaseVerifyier = new Sequelize('', username, password, config);
await databaseVerifyier.query(`CREATE DATABASE IF NOT EXISTS \`${name}\`;`);

const sequelize = new Sequelize(name, username, password, config);
await sequelize.authenticate();
await sequelize.sync();

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.DataTypes = DataTypes;
export default db;
