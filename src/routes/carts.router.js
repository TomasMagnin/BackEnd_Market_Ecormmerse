import express from "express";
import { isUser } from "../middlewares/auth.js";
import { CartsController } from '../controllers/carts.controller.js';
const cartsController = new CartsController();

export const cartsRouter = express.Router();

cartsRouter.post('/', cartsController.createCart);
cartsRouter.get('/:cid', cartsController.getCart);
cartsRouter.post('/:cid/product/:pid', isUser, cartsController.addProductToCart);
cartsRouter.delete('/:cid/products/:pid', cartsController.removeProductFromCart);
cartsRouter.put('/:cid', cartsController.updateCart);
cartsRouter.put('/:cid/products/:pid', cartsController.updateProductQuantity);
cartsRouter.delete('/:cid', cartsController.clearCart);
cartsRouter.post('/:cid/purchase', cartsController.purchaseCart);