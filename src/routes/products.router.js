import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import { ProductsController } from '../controllers/products.controller.js';
const productsController = new ProductsController();


export const productsRouter = express.Router();

productsRouter.get('/mockingproducts', productsController.mock);
productsRouter.get('/', productsController.getAllProducts);
productsRouter.get('/:pid', productsController.getProductById);
productsRouter.post('/', productsController.createProduct);
productsRouter.put('/:pid', isAdmin, productsController.updateProduct);
productsRouter.delete('/:pid', isAdmin, productsController.deleteProduct);
