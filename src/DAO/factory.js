import { config } from "../config/config.js";
import { mongoose } from "mongoose";
import logger from "../utils/logger.js";

let Products;
let Carts;

switch (config.persistence) {
    case 'MONGO':
        logger.info('Mongo connected');

        mongoose.connect(process.env.MONGODB_URL);
        const ProductsMongo = require('./mongo/products.mongo.js').default;
        const CartsMongo = require('./mongo/carts.mongo.js').default;
        Products = ProductsMongo;
        Carts = CartsMongo;

    break;
    case 'FILESYSTEM':
        logger.info('Persistence with Memory');
        const ProductsMemory = require('./memory/ProductManager.js').default;
        const CartsMemory = require('./memory/CartManager.js').default;
        Products = ProductsMemory;
        Carts = CartsMemory

    break;
    default:
    break;
}

export { Products, Carts };

