import { Op } from 'sequelize';
import Check from '../models/check.js';
import validateRequest from '../utils/validation.js';
import { createCheckSchema, updateCheckSchema, uuidSchema, tagSchema } from '../validations/checks.js'
import cornJobs from '../services/cronJobs.js';

export const getAllChecks = async (req, res, next) => {
    const { user } = res.locals;
    const checks = await Check.findAll({ where: { userId: user.uuid } });

    if (!checks) {
        return res.status(200).json({ code: 404, message: 'No URLs yet', dataList: [] });
    }

    return res.status(200).json({ code: 200, message: "Data found", dataList: checks });
}

export const getSingleCheck = async (req, res, next) => {
    const { user } = res.locals;

    const idValidationError = validateRequest(req.params, uuidSchema);
    if (idValidationError) {
        return res.status(400).json({ code: 400, errors: idValidationError });
    }

    const check = await Check.findOne({
        where: {
            checkUUID: req.params.uuid,
            userId: user.uuid
        }
    });

    if (!check) {
        return res.status(200).json({ code: 404, message: 'No data found', dataList: [] });
    }

    return res.status(400).json({ code: 200, message: "Data found", dataList: check });
}

export const getCheckByTag = async (req, res, next) => {
    const { user } = res.locals;

    const tagValidationError = validateRequest(req.params, tagSchema);
    if (tagValidationError) {
        return res.status(400).json({ code: 400, errors: tagValidationError });
    }

    const check = await Check.findAll({
        where: {
            userId: user.uuid,
            tags: {
                [Op.like]: `%${req.params.tagStr}%`,
            }
        }
    });

    if (check.length === 0) {
        return res.status(200).json({ code: 404, message: 'No data found', dataList: [] });
    }

    return res.status(200).json({ code: 200, message: "Data found", dataList: check });
}

export const createCheck = async (req, res, next) => {
    try {
        const { user } = res.locals;

        const validationErrors = validateRequest(req.body, createCheckSchema);
        if (validationErrors) {
            return res.status(400).json({ code: 400, message: validationErrors });
        }

        const isCheckExists = await Check.findOne({ where: { domain: req.body.domain, path: req.body.path, protocol: req.body.protocol, userId: user.uuid } });
        if (isCheckExists) {
            return res.status(409).json({ code: 409, errors: 'This URL is already exists in your check list' });
        }

        req.body.tags = (req.body.tags) ? req.body.tags.join('|') : null;
        req.body.httpHeaders = (req.body.httpHeaders) ? req.body.httpHeaders.join('|') : null;

        const check = Check.build({ ...req.body, userId: user.uuid });
        await check.save();

        cornJobs.addTask(check);

        return res.status(201).json({
            code: 201,
            message: `Check has been created successfully`,
        });

    } catch (error) {
        next(error);
    }
}

export const updateCheck = async (req, res, next) => {
    try {
        const { user } = res.locals;

        const idValidationError = validateRequest(req.params, uuidSchema);
        if (idValidationError) {
            return res.status(400).json({ code: 400, errors: idValidationError });
        }

        const validationErrors = validateRequest(req.body, updateCheckSchema);
        if (validationErrors) {
            return res.status(400).json({ code: 400, message: validationErrors });
        }

        const check = await Check.findOne({
            where: {
                checkUUID: req.params.uuid,
                userId: user.uuid
            }
        });

        if (!check) {
            return res.status(400).json({ code: 400, errors: "Invalid check ID or you don't have permission to update this check" });
        }

        const alternative = await Check.findOne({
            where: {
                domain: req.body.domain,
                path: req.body.path,
                protocol: req.body.protocol,
                userId: user.uuid,
                checkUUID: {
                    [Op.ne]: req.params.uuid
                },
            }
        });

        if (alternative) {
            return res.status(400).json({ code: 400, errors: `You already have an alternative operation with name: ${alternative.name}` });
        }


        req.body.tags = (req.body.tags) ? req.body.tags.join('|') : null;
        req.body.httpHeaders = (req.body.httpHeaders) ? req.body.httpHeaders.join('|') : null;


        await Check.update({ ...req.body }, { where: { checkUUID: req.params.uuid } });

        cornJobs.removeTask(req.params.uuid);
        cornJobs.addTask({ ...req.body, checkUUID: req.params.uuid });

        return res.status(200).json({
            code: 200,
            message: `Check has been updated successfully`,
        });

    } catch (error) {
        next(error);
    }
}

export const deleteCheck = async (req, res, next) => {
    try {
        const { user } = res.locals;

        const idValidationError = validateRequest(req.params, uuidSchema);
        if (idValidationError) {
            return res.status(400).json({ code: 400, errors: idValidationError });
        }

        const check = await Check.findOne({
            where: {
                checkUUID: req.params.uuid,
                userId: user.uuid
            }
        });

        if (!check) {
            return res.status(400).json({ code: 400, errors: "Invalid check ID or you don't have permission to update this check" });
        }

        cornJobs.removeTask(req.params.uuid);

        await Check.destroy({
            where: {
                checkUUID: req.params.uuid,
                userId: user.uuid
            }
        });

        return res.status(200).json({
            code: 200,
            message: `Check has been deleted successfully`,
        });

    } catch (error) {
        next(error);
    }
}