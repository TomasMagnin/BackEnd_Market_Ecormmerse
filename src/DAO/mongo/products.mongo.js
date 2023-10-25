import { ProductModel } from "./models/products.model.js";

export class ProductMongo{
    async createProduct(prod){
        const product = await ProductModel.create(prod);
        return product;
    };

    async deleteProduct(){
        const product = await ProductModel.deleteOne();
        return product;
    };

    async updateProduct(){
        const product = await ProductModel.updateOne();
        return product;
    };

    async getProduct(productId){
        const product = await ProductModel.findById(productId);
        return product;
    }

    async findProduct(){
        const product = await ProductModel.findOne();
        return product
    }
};