import express from "express";
import { isPremium, isAdmin, isUser } from "../middlewares/auth.js";
import { ProductsController } from '../controllers/products.controller.js';
const productsController = new ProductsController();


export const productsRouter = express.Router();

productsRouter.get('/mockingproducts', productsController.mock);
productsRouter.get('/', productsController.getAllProducts);
productsRouter.get('/:pid', productsController.getProductById);
productsRouter.post('/', isPremium, isAdmin, productsController.createProduct);
productsRouter.put('/:id', isAdmin, productsController.updateProduct);
productsRouter.delete('/:id', isPremium, isAdmin, productsController.deleteProduct);
