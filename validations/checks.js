import Joi from 'joi';

const optionalKeys = Joi.object({
    path: Joi.string().optional().allow(null),
    port: Joi.number().positive().optional().allow(null),
    webhook: Joi.string().optional().allow("", null),
    timeout: Joi.number().positive().optional(),
    interval: Joi.number().positive().optional(),
    threshold: Joi.number().positive().optional(),
    authUsername: Joi.string().optional().allow(null),
    authPassword: Joi.string().optional().allow(null),
    httpHeaders: Joi.array().items(Joi.string()).optional(),
    assert: Joi.number().positive().required().optional(),
    tags: Joi.array().items(Joi.string()).optional()
});


export const createCheckSchema = optionalKeys.keys({
    name: Joi.string().min(3).max(30).required(),
    domain: Joi.string().domain().required(),
    protocol: Joi.string().required().valid('HTTP', 'HTTPS', 'TCP'),
    ignoreSSL: Joi.boolean().required()
});
export const updateCheckSchema = optionalKeys.keys({
    name: Joi.string().min(3).max(30).optional(),
    domain: Joi.string().domain().optional(),
    protocol: Joi.string().optional().valid('HTTP', 'HTTPS', 'TCP'),
    ignoreSSL: Joi.boolean().optional()
});


export const uuidSchema = Joi.object({
    uuid: Joi.string().guid({ version: ['uuidv4'] }).required()
});

export const tagSchema = Joi.object({
    tagStr: Joi.string()
});