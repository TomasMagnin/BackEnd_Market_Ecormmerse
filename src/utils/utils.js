/* ----------------- MONGOOSE ------------ */

 import { connect, Schema, model } from "mongoose";
 import logger from "./logger.js";
 import dotenv from "dotenv";
 dotenv.config();


 export async function connectMongo() {
   try {                  
       const mongodbUrl = process.env.MONGODB_URL;      
       await connect(mongodbUrl);
       //"mongodb+srv://tomasmagnin:wRHD9t0bpXzg74iX@backendcoder.tsh7jee.mongodb.net/ecommerce?retryWrites=true&w=majority"
       
       logger.info("plug to mongo!");          
    
    } catch (error) {
      logger.error(error);
      throw "can not connect to the db";      
    }
 }
 
  
 /* ----------------- SOCKET ------------ */
 import { Server } from "socket.io";                 // Importamos el servidor Socket.
 import { ChatModel   } from "../DAO/mongo/models/chats.model.js";
 import { ProductService } from "../services/products.service.js";   


 export function connectSocket(httpServer) {          
    const socketServer = new Server(httpServer);        
 
 

 socketServer.on("connection", (socket)=> {  // Cada vez que se crea y conecta un socket en el front para comunicar al back se creak un socket.
     // Back Recibe 
     logger.debug('New user connected');

     socket.on("addProduct", async (entries) => {
        const product = await ProductService.createOne(entries);
        socketServer.emit("addedProduct", product);
      });
  
      socket.on("deleteProduct", async (id) => {
        await ProductService.deleteOne(id);
        socketServer.emit("deletedProduct", id);
      });
  
      socket.on("msg_front_to_back", async (msg) => {               
        const msgCreated = await ChatModel.create(msg);             
        const messages = await ChatModel.find({});
         
        socketServer.emit("msg_back_to_front", messages);           
      });
    });
  }


/* --------------------       BCRYPT       -------------------- */ 
import bcrypt from 'bcrypt';


export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

/* --------------------- FAKER --------------------- */

import { faker } from '@faker-js/faker';

faker.constructor = "es";

export const generateProduct = () => {
    return {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      thumbnail: faker.image.imageUrl(),
      code: faker.random.alphaNumeric(10),
      stock: faker.random.numeric(3),
      category: faker.word.noun(),
    }
};

