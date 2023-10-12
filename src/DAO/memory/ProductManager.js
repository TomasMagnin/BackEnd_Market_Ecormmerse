import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import logger from "../utils/logger.js";

export class ProductManager{
    constructor(path) {
        this.path = path;
    }

    async createProduct(product) {
        try {
            const products = await this.getProduct();
            const codeExists = products.some((p) => p.code === product.code);
            if(codeExists) {
                throw new Error("Product with the same code already exists");
            }
            logger.debug(product);
            if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.category) {
                throw new Error ("All fields are mandatory")
            }

            const newProduct = { ...product, id: uuidv4()};
            products.push(newProduct);
            await this.writeProducts(products);
            return newProduct;
        }
        catch (err){
            logger.error("Error in addProduct method:", err);
            throw new Error ("addProduct method failed")
        }
    }

    async getProduct() {
        try {
            const data = await fs.promises.readFile(this.path, "utf8");
            return JSON.parse(data);
        } catch (err) {
            return [];
            }
    }

    async getProductById(productId) {
        try {
            const products = await this.getProduct();
            const product = products.find((p) => p.id === productId);
            if (product) {
                return product;
            }else{
                throw new Error('Product not found');
            }
        }catch (err) {
            throw new Error ("getProductById method failed")
        }
    }

    async updateProduct(productId, changes){
        try {
            const products = await this.getProduct();
            const productIndex = products.findIndex((p) => p.id === productId);
            if (productIndex === -1) {
                throw new Error("Product with the specified id not found");
            }

            const {id, ...update} = changes
            const updatedProduct = {...products[productIndex], ...update};
            products[productIndex] = updatedProduct;
            await this.writeProducts(products);
            return updatedProduct;
        }catch (err){
            throw new Error ("updateProduct method failed")
        }
    }

    async deleteProduct(productId) {
        try {
            const products = await this.getProduct();
            const productIndex = products.findIndex((p) => p.id === productId);
            if (productIndex === -1) {
                throw new Error('Product not found');
            }
    
            products.splice(productIndex, 1);
            await this.writeProducts(products);
        }catch (err) {
            throw new Error ("deleteProduct method failed")
        }
    }

    async writeProducts(products) {
        try{
            await fs.promises.writeFile(this.path, JSON.stringify(products));
        }catch (err){
            throw new Error(`Error writing products to file: ${err}`);
        }
        
    }
};