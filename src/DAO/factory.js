import { config } from "../config/config.js";
import { mongoose } from "mongoose";
import logger from "../utils/logger.js";
import ProductsMongo from "./mongo/products.mongo.js"
import CartsMongo from "./mongo/carts.mongo.js"
import ProductsMemory from "./memory/ProductManager.js"
import CartsMemory from "./memory/CartManager.js"

let Products;
let Carts;

switch (config.persistence) {
    case 'MONGO':
        logger.info('Mongo connected');

        mongoose.connect(process.env.MONGODB_URL);
        Products = ProductsMongo;
        Carts = CartsMongo;

    break;
    case 'FILESYSTEM':
        logger.info('Persistence with Memory');
        Products = ProductsMemory;
        Carts = CartsMemory

    break;
    default:
    break;
}

export { Products, Carts };

