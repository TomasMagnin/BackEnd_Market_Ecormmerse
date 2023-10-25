import express from "express";
import { isLoggedIn  } from "../middlewares/auth.js";
import { ViewsController } from "../controllers/views.controller.js";
const viewsController = new ViewsController();


export const viewsRouter = express.Router();


viewsRouter.get('/', isLoggedIn, viewsController.getHome);
viewsRouter.get('/realtimeproducts', isLoggedIn, viewsController.getRealTimeProducts);
viewsRouter.get('/products', isLoggedIn, viewsController.getProducts);
viewsRouter.get('/products/:pid', isLoggedIn, viewsController.getProduct);
viewsRouter.get('/carts/:cid', isLoggedIn, viewsController.getCart);
viewsRouter.get('/login', viewsController.getLogin);
viewsRouter.get('/loggerTest', viewsController.loggerTest);