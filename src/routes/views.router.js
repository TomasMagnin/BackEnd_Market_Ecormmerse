import express from "express";
import { ViewsController } from '../controllers/views.controller.js';
const viewsController = new ViewsController();


export const viewsRouter = express.Router();


viewsRouter.get('/', viewsController.getHome);
viewsRouter.get('/realtimeproducts', viewsController.getRealTimeProducts);
viewsRouter.get('/products', viewsController.getProducts);
viewsRouter.get('/products/:pid', viewsController.getProduct);
viewsRouter.get('/carts/:cid', viewsController.getCart);
viewsRouter.get('/login', viewsController.getLogin);
viewsRouter.get('/loggerTest', viewsController.loggerTest);