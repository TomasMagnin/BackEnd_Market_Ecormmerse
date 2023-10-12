import { ViewsService } from '../services/views.service.js';
import { CustomError } from "../services/errors/custom-error.js";
import EErros from "../services/errors/enums.js";
import logger from "../utils/logger.js";

const viewsService = new ViewsService();

export class ViewsController {
    async getHome(req, res) {
            const { limit = 10, page = 1, sort, query } = req.query;
            const queryParams = { limit, page, sort, query };
            const products = await viewsService.getHome(queryParams);
            if (products instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: products,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            return res.status(200).render('home', { products });
    }

    async getRealTimeProducts(req, res) {
            const products = await viewsService.getRealTimeProducts();
            if (products instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: products,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            return res.status(200).render('realTimeProducts', { products });
    }

    async getProducts(req, res) {
            const { limit = 10, page = 1, sort, query } = req.query;
            const queryParams = { limit, page, sort, query };
            const products = await viewsService.getProducts(queryParams);
            if (products instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: products,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            return res.render('products', products);
    }

    async getProduct(req, res, next) {
        try {
            const { pid } = req.params;
            const product = await viewsService.getProduct(pid);
            res.render('product', { product });
        } catch (error) {
        next(error);
        }
    }

    async getCart(req, res, next) {
        try {
            const { cid } = req.params;
            const cart = await viewsService.getCart(cid);
            res.render('cart', { cart });
        } catch (error) {
            next(error);
        }
    }

    async getLogin(req, res) {
        res.render('login');
    }

    async loggerTest(req, res) {
        logger.debug('Debug log for testing');
        logger.info('Info log for testing');
        logger.warn('Warning log for testing');
        logger.error('Error log for testing');
        logger.fatal('Fatal log for testing');

        res.status(200).json({ message: 'Logs tested successfully' });
    }
}
