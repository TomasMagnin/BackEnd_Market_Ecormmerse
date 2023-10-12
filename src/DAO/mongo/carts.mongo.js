import { CartModel } from "./models/carts.model.js";

export class CartMongo {
    async createCart(){
        const cart = await CartModel.create({});
        return cart;
    };

    async getCart(){
        const cart = await CartModel.findById();
        return cart;
    }

    async updateCart(){
        const cart = await CartModel.findByIdAndUpdate();
        return cart;
    };
};