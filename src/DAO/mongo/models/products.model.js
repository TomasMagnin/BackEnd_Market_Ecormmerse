import { Schema, model } from "mongoose";
import mongoosePaginate  from "mongoose-paginate-v2";       // Importamos el modulo de paginacion.


const schema = new Schema({
    title: { type: String, required: true, max: 100, unique: true },
    description: { type: String, required: true, max: 100 },
    price: { type: String, required: true, max: 100 },
    thumbnail: { type: String, required: true, max: 100 },
    code: { type: String, required: true, max: 100 },
    stock: { type: String, required: true, max: 100 },
    category: { type: String, required: true, max: 100 },
    owner: { type: String, required: true, default: 'admin' },
});
     
schema.plugin(mongoosePaginate);                                                                                      
export const ProductModel = model("products", schema);          
