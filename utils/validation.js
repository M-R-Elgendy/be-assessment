function validateRequest(data, schema) {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        const validationErrors = error.details.map((err) => err.message);
        return validationErrors;
    }
    return null;
}

export default validateRequest;
