import { Op } from 'sequelize';
import Check from '../models/check.js';
import Report from '../models/report.js';

import validateRequest from '../utils/validation.js';
import { uuidSchema, tagSchema } from '../validations/checks.js'


export const getAllReports = async (req, res, next) => {
    try {

        const { user } = res.locals;

        const checks = await Check.findAll({ where: { userId: user.uuid } });
        if (!checks) return res.status(200).json({ code: 404, message: 'Check not found', dataList: [] });

        let checksIds = [];
        checks.forEach((check) => {
            checksIds.push(check.checkUUID);
        });

        const reports = await Report.findAll({
            where: { checkId: checksIds },
        });

        const report = generatReport(checks, reports);

        return res.status(200).json({ code: 200, message: "Data found", data: report });

    } catch (error) {
        next(error);
    }
}

export const getReportByCheckId = async (req, res, next) => {
    try {
        const { user } = res.locals;

        const idValidationError = validateRequest(req.params, uuidSchema);
        if (idValidationError) {
            return res.status(400).json({ code: 400, errors: idValidationError });
        }
        const check = await Check.findAll({ where: { checkUUID: req.params.uuid, userId: user.uuid } }); // "The "findAll" function is used to enable the use of the "generateReport" function."
        if (!check) return res.status(200).json({ code: 404, message: 'Check not found', dataList: [] });

        const reports = await Report.findAll({
            where: { checkId: req.params.uuid },
            order: [
                ['createdAt', 'DESC']
            ],
        });
        if (!reports) return res.status(200).json({ message: 'No reports found' });

        const checkReport = generatReport(check, reports);
        return res.status(200).json({ code: 200, message: "Data found", data: checkReport });
    } catch (error) {
        next(error);
    }
};

export const getReportByTagName = async (req, res, next) => {
    try {
        const { user } = res.locals;

        const tagValidationError = validateRequest(req.params, tagSchema);
        if (tagValidationError) {
            return res.status(400).json({ code: 400, errors: tagValidationError });
        }

        const checks = await Check.findAll({
            where: {
                userId: user.uuid,
                tags: {
                    [Op.like]: `%${req.params.tagStr}%`,
                }
            }
        });

        if (!checks) return res.status(200).json({ code: 404, message: 'Check not found', dataList: [] });

        let checksIds = [];
        checks.forEach((check) => {
            checksIds.push(check.checkUUID);
        });

        const reports = await Report.findAll({
            where: { checkId: checksIds }
        });

        if (!reports) return res.status(200).json({ message: 'Report not found' });

        const report = generatReport(checks, reports);

        return res.status(200).json({ code: 200, message: "Data found", dataList: report });
    } catch (error) {
        next(error);
    }
};


// Function to generate report from multible checks and reports
function generatReport(checks, reports) {
    let finalReport = [];
    checks.forEach((check) => {
        let subReports = [];
        reports.forEach((report) => {
            if (report.checkId == check.checkUUID) {
                subReports.push(report);
            }
        });

        let
            currentStatus = (subReports[0].availability == 1) ? 'Up' : 'Down',
            availabilityPercentage = 0,
            outages = 0,
            downtime = 0,
            uptime = 0,
            responseTime = 0,
            avalibileTimes = 0,
            responseTimeSum = 0;

        subReports.forEach((report) => {
            if (report.availability == true) {
                avalibileTimes += 1;
                responseTimeSum += report.responseTime;
            } else {
                outages++;
            }
        });

        availabilityPercentage = ((avalibileTimes / reports.length) * 100);
        downtime = ((outages * check.interval) * 60);
        uptime = ((avalibileTimes * check.interval) * 60);
        responseTime = responseTimeSum / avalibileTimes;

        const finalSubeport = {
            check: {
                uuid: check.checkUUID,
                name: check.name,
                domain: check.domain
            },
            status: currentStatus,
            availability: `${Math.round(availabilityPercentage)} %`,
            outages,
            downtime: `${downtime} s`,
            uptime: `${uptime} s`,
            averageResponseTime: `${responseTime} s`,
            history: subReports
        }

        finalReport.push(finalSubeport);

    });

    return finalReport;
}
