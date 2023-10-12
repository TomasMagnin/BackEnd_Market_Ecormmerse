export function isUser(req, res, next) {
    if (req.session.user && req.session.user.role === 'user') {
        return next();
    } else {
        return res.status(403).json({ error: 'Access denied. Only users are allowed.' });
    }
};

export function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ error: 'Access denied. Only admins are allowed.' });
    }
};

export function isPremium(req, res, next) {
    const user = req.user;
    if (user && user.role === 'premium') {
        return next();
    }
    return res.status(403).json({ message: 'You do not have permission to perform this action.' });
};