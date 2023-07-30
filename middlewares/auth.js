import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ code: 401, message: 'Access denied' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const tokenData = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        res.locals.user = tokenData;
        next();
    } catch (error) {
        next(error);
        return res.status(401).json({ code: 401, errors: 'Invalid token' });
    }
};

export default auth;
