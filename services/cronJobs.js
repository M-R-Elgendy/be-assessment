import cron from 'node-cron';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Check from '../models/check.js';
import Report from '../models/report.js';
import notification from '../services/notifyUser.js';
import User from '../models/user.js';

class CronJob {
    constructor() {
        this.taskMap = {};
    }

    async runCheck(check) {

        const {
            checkUUID,
            domain,
            protocol,
            path,
            port,
            timeout,
            threshold,
            authUsername,
            authPassword,
            httpHeaders,
            assert,
            ignoreSSL
        } = check;
        const url = `${protocol}://${domain}${(path != null) ? "/" + path : ''}${(port != null) ? ":" + port : ''}`;

        console.log(`Test => ${url}`)

        const client = axios.create({
            baseURL: url,
            timeout: timeout * 1000,
            rejectUnauthorized: (ignoreSSL == 1) ? false : true,
            auth: {
                username: authUsername,
                password: authPassword
            }
        });

        client.interceptors.request.use((config) => {
            config.headers['request-startTime'] = process.hrtime()
            return config
        });

        client.interceptors.response.use((response) => {
            const start = response.config.headers['request-startTime']
            const end = process.hrtime(start)
            const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000))
            response.headers['request-duration'] = milliseconds
            return response
        });

        axiosRetry(client, { retries: threshold });
        let report = Report.build({
            checkId: checkUUID,
        });

        try {
            // const startTime = Date.now();
            const res = await client.get(path);
            // const endTime = Date.now();
            // const responseTime = endTime - startTime;
            const responseTime = res.headers['request-duration']; // Provide more accuracy difference may be (>= 5 ms) 

            if (assert && res.status !== assert) {
                report.note = 'status code does not match';
                report.availability = false;
                report.responseTime = 0;
            } else {
                report.availability = true;
                report.responseTime = responseTime;
            }
            await this.sendEmailOfStatus(check, report.availability);
            await report.save();
        } catch (error) {

            report.note = error.message;
            report.availability = false;
            report.responseTime = 0;
            await this.sendEmailOfStatus(check, false);
            await report.save();
        }
    }

    async start() {
        const checks = await Check.findAll();
        checks.forEach((check) => {
            this.addTask(check);
        });
    }

    addTask(check) {
        const task = cron.schedule(`*/${check.interval}  * * * *`, () => {
            this.runCheck(check);
        });
        this.taskMap[check.checkUUID] = task;
    }

    removeTask(checkId) {
        const task = this.taskMap[checkId];
        if (task) {
            task.stop();
            delete this.taskMap[checkId];
        }
    }

    async sendEmailOfStatus(check, currentStatus) {
        const url = `${check.protocol}://${check.domain}${(check.path != null) ? "/" + check.path : ''}${(check.port != null) ? ":" + check.port : ''}`;

        const checkData = await Check.findOne({
            where: { checkUUID: check.checkUUID },
            include: [
                { model: User, attributes: ['email'] },
                { model: Report, order: [['createdAt', 'DESC']], limit: 1 }
            ]
        });

        const lastStatus = checkData.reports[0];
        const user = checkData.User;

        let message = '';
        if (!lastStatus) {
            if (currentStatus == 1) {
                message = `Congratulations! The first check of your URL (${url}) shows that it is up.`;
            } else {
                message = `Unfortunately! The first check of your URL (${url}) shows that it is down.`;
            }
        } else {
            if (lastStatus.availability == 0 && currentStatus == 1) {
                message = `New status report: (${url}) currently up.`;
            } else if (lastStatus.availability == 1 && currentStatus == 0) {
                message = `New status report: (${url}) currently down.`;
            }
        }

        if (message != '') {
            notification.send(message, user.email);
        }
        return;
    }
}


const cornJobs = new CronJob();
export default cornJobs;