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

    async renderSessionView(req, res) {
        try {
            return res.send(JSON.stringify(req.session));  
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong :(',
                data: {},
            });
        }     
    };

    async renderLoginView(req, res) {
        try {
            return res.render("login", {});    
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong :(',
                data: {},
            });
        }    
    };

    async handleLogin(req, res) {
       try {
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
           return res.redirect("/");
       } catch (error) {
           logger.error(error);
           return res.status(500).json({
               status: 'error',
               msg: 'something went wrong :(',
               data: {},
           });
       }    
    };

    async renderFailLoginView(req, res) {
       try {
           return res.json({ error: 'fail to login' });   
       } catch (error) {
           logger.error(error);
           return res.status(500).json({
               status: 'error',
               msg: 'something went wrong :(',
               data: {},
           });
       }    
    };

    async renderRegisterView(req, res) {
       try {
        if(req.session.user) {
            res.redirect('/');
            return
        }
        return res.render("register", {});
       } catch (error) {
           logger.error(error);
           return res.status(500).json({
               status: 'error',
               msg: 'something went wrong :(',
               data: {},
           });
       }        
    };

    async handleRegister(req, res) {
       try {
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
        } catch (error) {
           logger.error(error);
           return res.status(500).json({
               status: 'error',
               msg: 'something went wrong :(',
               data: {},
           });
       }
    };

    async renderFailRegisterView(req, res) {
        try {
            return res.json({ error: 'fail to register' });   
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong :(',
                data: {},
            });
        }     
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

    async renderProfileView(req, res) {
       try {
            const user = { email: req.session.user.email, isAdmin: req.session.user.role === ROLES.ADMIN ? 'SI': 'NO', _id: String(req.session.user._id) };
            return res.render("profile", { user: user });
       } catch (error) {
           logger.error(error);
           return res.status(500).json({
               status: "error",
               msg: 'something went wrong :(',
               data: {},
           });
       }    
    };

    async handleLogout(req, res) {
        try { 
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
        } catch (error) {
           logger.error(error);
           return res.status(500).json({
               status: "error",
               msg: "something went wrong",
               data: {},
           });
        }
    };

    renderGitHubLogin(req, res) {
        try {
            return passport.authenticate('github', { scope: ['user:email'] })(req, res);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong :(',
                data: {},
            });
        }
     };

    handleGitHubCallback(req, res, next) {
       try {
            passport.authenticate('github', { failureRedirect: '/login' })(req, res, (err) => {
                if (err) {
                    logger.error('Error in auth GitHub callback:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                return res.redirect('/');
            });
       } catch (error) {
           logger.error(error);
           return res.status(500).json({
               status: 'error',
               msg: 'something went wrong :(',
               data: {},
           });
       }
    };

    recoverPassword(req, res) {
        res.render('recoverPassword');
    };

    async checkEmail (req, res) {
        try {
            const {email} = req.body;
            await codeService.generateCode(email);
            res.render('checkEmail');
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong :(',
                data: {},
            });
        }
    };

    async resetPassword(req, res) {
        try {
            const {email, code} = req.query;
            const isValidCode = await codeService.findCode(email, code);
            if (isValidCode) {
                res.render('resetPassword', { email, code });
            } else {
                res.render('error');
            }
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong',
                data: {},
            });
        }
    };

    async resetPasswordComplete(req, res) {
        try {    
            const { password, email } = req.body;
            const passwordHash = createHash(password)
            const updatedUser = await codeService.updateUser(email, passwordHash);
            res.redirect("/auth/login")
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong :(',
                data: {},
            });
        }
    };

    async  uploadDocuments(req, res) {
        try {
            const { uid } = req.params;
            const { files } = req;
            const response = await authService.uploadDocuments(uid, files);
            return res.status(200).json({ message: "ok"});
       
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong',
                data: {},
            });
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
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong',
                data: {},
            });
        }
    };

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
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong',
                data: {},
            });
        }
    };

};
