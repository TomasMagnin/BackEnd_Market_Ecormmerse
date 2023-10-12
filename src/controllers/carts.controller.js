import { CartService } from "../services/carts.service.js";
const cartService = new CartService();
import { TicketService } from "../services/tickets.service.js";
const ticketService = new TicketService();
import { CustomError } from "../services/errors/custom-error.js";
import EErros from "../services/errors/enums.js";

export class CartsController {
    async createCart(req, res) {     
            const newCart = await cartService.createCart();
            if (newCart instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: newCart,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            res.status(201).json(newCart);   
    }

    async getCart(req, res) {   
            const cartId = req.params.cid;
            const cart = await cartService.getCart(cartId);
            if (cart instanceof Error) {
                CustomError.createError({
                    name: '404 not found error',
                    cause: cart,
                    message: 'Not Found',
                    code: EErros.NOT_FOUND_ERROR,
                });
            }
            res.status(200).json(cart);
    }

    async addProductToCart(req, res) {
            const { cid, pid } = req.params;
            const cart = await cartService.addProductToCart(cid, pid);
            if (cart instanceof Error) {
                CustomError.createError({
                    name: '404 not found error',
                    cause: cart,
                    message: 'Not Found',
                    code: EErros.NOT_FOUND_ERROR,
                });
            }
            res.status(200).json(cart);
    }

    async removeProductFromCart(req, res) {
            const { cid, pid } = req.params;
            const cart = await cartService.removeProduct(cid, pid);
            if (cart instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: cart,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            res.status(200).json({
                status: "success",
                message: "Product removed from cart",
                cart,
            });
    }

    async updateCart(req, res) {
            const { cid } = req.params;
            const { products } = req.body;
            const cart = await cartService.updateCart(cid, products);
            if (cart instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: cart,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            res.status(200).json({
                status: "success",
                message: "Cart updated successfully",
                cart,
            });
    }

    async updateProductQuantity(req, res) {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const cart = await cartService.updateProductQuantity(cid, pid, quantity);
            if (cart instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: cart,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            res.status(200).json({ status: "success", message: "Product quantity updated", cart });
        
    }

    async clearCart(req, res) {
        try {
            await cartService.clearCart(cid);
            res.status(200).json({ status: 'success', message: 'Cart cleared successfully' });
        } catch (error) {
            CustomError.createError({
                name: 'Controller message error',
                cause: error,
                message: 'something went wrong :(',
                code: EErros.INTERNAL_SERVER_ERROR,
            });
        }
    }

    async purchaseCart(req, res) {
        
            const { cid } = req.params;
            const cart = await cartService.getCart(cid);

            const productsNotProcessed = await cartService.processPurchase(cart);
            const purchaserEmail = cart.userId;
            const totalAmount = cartService.calculateTotalAmount(cart);

            const ticket = await ticketService.createTicket(purchaserEmail, totalAmount);
            cartService.removeProcessedProducts(cart, productsNotProcessed);

            if (ticket instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: ticket,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            return res.status(200).json({ productsNotProcessed, ticketId: ticket._id });
    }
}
