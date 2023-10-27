import { UserModel } from "../DAO/mongo/models/users.model.js";
import { CustomError } from "../services/errors/custom-error.js";
import passport  from "passport";
import EErros from "../services/errors/enums.js";
import logger from "../utils/logger.js";
import { CodeService } from "../services/code.service.js";
import { createHash } from "../utils/utils.js";
const codeService = new CodeService();
import { AuthService } from "../services/auth.service.js";
const authService = new AuthService();
import { ROLES } from "../utils/constants.js";

export class AuthController {

    renderGitHubLogin(req, res) {
        return passport.authenticate('github', { scope: ['user:email'] })(req, res);
    };
    
    handleGitHubCallback(req, res, next) {
        passport.authenticate('github', { failureRedirect: '/login' })(req, res, (err) => {
            if (err) {
                logger.error('Error in auth GitHub callback:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            return res.redirect('/');
        });
    };
    
    renderSessionView(req, res) {
        return res.send(JSON.stringify(req.session));
    };
    
    renderLoginView(req, res) {
        return res.render("login", {});
    };
    
    async handleLogin(req, res) {
        if (!req.user) {
            CustomError.createError({
                name: 'fields missing or incorrect',
                cause: 'there was an error in one of the methods',
                message: 'validation error: please complete or correct all fields.',
                code: EErros.VALIDATION_ERROR,
            });
        }
        const user = await UserModel.findById(req.user._id);
        if (user) {
            user.last_connection = new Date();
            await user.save();
        }
        req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, age: req.user.age, role: req.user.role };
        return res.redirect('/');
    };
    
    async renderFailLoginView(req, res) {
        return res.json({ error: 'fail to login' });
    };
    
    renderRegisterView(req, res) {
        if(req.session.user) {
            res.redirect('/');
            return
        }
        return res.render("register", {});
    };
    
    handleRegister(req, res) {
        if (!req.user) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: 'there was an error in one of the methods',
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
        }
        req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, age: req.user.age, isAdmin: req.user.isAdmin };
        return res.json({ msg: 'ok', payload: req.user });
    };
    
    async renderFailRegisterView(req, res) {
        return res.json({ error: 'fail to register' });
    };
    
    async renderProductsView(req, res) {
        try {
            const user = await UserModel.findOne({ email: req.session.email });
            if (user) {
                const userData = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    age: user.age,
                    cartID: user.cartID,
                    role: user.role,
                };
                logger.debug('Rendering products view with user data:', userData);
                return res.render('products', { user: userData });
            } else {
                logger.debug('Rendering products view with no user data');
                return res.render('products', { user: null });
            }
        } catch (error) {
            logger.error('Error retrieving user data:', error);
            return res.render('products', { user: null, error: 'Error retrieving user data' });
        }
    };
    
    renderProfileView(req, res) {
        const user = { email: req.session.user.email, isAdmin: req.session.user.role === ROLES.ADMIN ? 'SI': 'NO', _id: String(req.session.user._id) };
        return res.render('profile', { user: user });
    };
    
    async handleLogout(req, res) {
        const user = await UserModel.findById(req.session.user._id);
        if (user) {
            user.last_connection = new Date();
            await user.save();
        };
    
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).render('error', { error: 'session couldnt be closed' });
            }
            return res.redirect('/auth/login');
        });
    };

    
    recoverPassword(req, res) {
        res.render('recoverPassword');
    };
    
    async checkEmail(req, res) {
        const {email} = req.body;
        await codeService.generateCode(email);
        res.render('checkEmail');
    };
    
    async resetPassword(req, res) {
        const {email, code} = req.query;
        const isValidCode = await codeService.findCode(email, code);
        if (isValidCode) {
            res.render('resetPassword', { email, code });
        } else {
            res.render('error');
        }
    };
    
    async resetPasswordComplete(req, res) {
        const { password, email } = req.body;
        const passwordHash = createHash(password)
        const updatedUser = await codeService.updateUser(email, passwordHash);
        res.redirect('/auth/login')
    }
    
    async uploadDocuments(req, res) {
        try {
            const { uid } = req.params;
            const { files } = req;
    
            const response = await authService.uploadDocuments(uid, files);
            return res.status(200).json({ message: 'ok' });
    
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    };
    
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find({}, 'name email role');
            res.status(200).json({ users });
        } catch (error) {
            CustomError.createError({
                name: 'Controller message error',
                cause: 'there was an error in one of the methods',
                message: 'something went wrong :(',
                code: EErros.INTERNAL_SERVER_ERROR,
            });
        }
    };
    
    async deleteInactiveUsers(req, res) {
        try {
            const result = await authService.deleteInactiveUsers();
            res.status(200).json({ message: 'Inactive users deleted and notifications sent.', result });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete inactive users.', error: error.message });
        }
    }
    
    async roleManager(req, res) {
        try {
            const user = req.session.user;
            if(user.role !== ROLES.ADMIN) {
                res.render('permissionDenied')
                return
            }
            let users = await UserModel.find({}, 'name email role').lean();
            users = users.filter(user => user.role !== ROLES.ADMIN)
            res.render('roleManager', { users });
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).send('Internal Server Error');
        }
    };
};