import express from "express";
import { isLoggedIn  } from "../middlewares/auth.js";
import {  AuthController } from '../controllers/auth.controller.js';
const authController = new AuthController();
import passport from 'passport';



export const authRouter = express.Router();

authRouter.get('/login/github', authController.renderGitHubLogin);
authRouter.get('/githubcallback', authController.handleGitHubCallback);
authRouter.get('/session', authController.renderSessionView);
authRouter.get('/login', authController.renderLoginView);
authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), authController.handleLogin);
authRouter.get('/faillogin', authController.renderFailLoginView);
authRouter.get('/register', authController.renderRegisterView);
authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), authController.handleRegister);
authRouter.get('/failregister', authController.renderFailRegisterView);
authRouter.get('/products', authController.renderProductsView);
authRouter.get('/profile', isLoggedIn, authController.renderProfileView);
authRouter.get('/logout', authController.handleLogout);
authRouter.get('/recoverPassword', authController.recoverPassword);
authRouter.post('/checkEmail', authController.checkEmail);
authRouter.get('/resetPassword', authController.resetPassword);
authRouter.post('/resetPasswordComplete', authController.resetPasswordComplete);
authRouter.get('/', authController.getAllUsers);
authRouter.delete('/', authController.deleteInactiveUsers);
authRouter.get('/roleManager', authController.roleManager);