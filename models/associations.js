import User from './user.js';
import Check from './check.js';
import Report from './report.js';

User.hasMany(Check, { foreignKey: 'userId', onDelete: "CASCADE" });
Check.belongsTo(User, { foreignKey: 'userId' });

Check.hasMany(Report, { foreignKey: 'checkId', onDelete: "CASCADE" });
Report.belongsTo(Check, { foreignKey: 'checkId' });

await User.sync();
await Check.sync();
await Report.sync();