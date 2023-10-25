import { Schema, model } from "mongoose";

const schema = new Schema({
    products: {
            type: [
                {
                    product: {type: Schema.Types.ObjectId, ref: "products", required: true},
                    quantity: {type: Number, default: 1},
                },
            ],
            default: [],
        },
});
                                                        
export const CartModel = model("carts", schema);        
