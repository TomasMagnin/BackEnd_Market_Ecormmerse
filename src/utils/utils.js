/* ----------------- DIRNAME ------------ */

/* 
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname + "/public"));    // El join()función para combinar dos rutas, Aca seteamos el destino de la de los archivos que suba es es __dirname(la ruta absoluta C:/src/public...) y la carpeta donde se sube todo.
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);        // En esta linea ponemos el nombre del archivo original.
    },
});

export const ulploader = multer({ storage });
 */

/* ----------------- DIRNAME ------------ */

// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
import path from "path";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);




/* ----------------- Levantamos el Cliente para la Base de Datos en Mongo Atlas en la Nube ------------- */
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
       
       logger.info("plug to mongo!");          // Si sale bien imprimimos.
    
    } catch (error) {
      logger.error(error);
      throw "can not connect to the db";      // Si sale mal imprimimos este otro
    }
 }
 
  
 /* ----------------- SOCKET ------------ */
 import { Server } from "socket.io";                 // Importamos el servidor Socket.
 import { ChatModel   } from "../DAO/mongo/models/chats.model.js";
 import { ProductService } from "../services/products.service.js";   


 export function connectSocket(httpServer) {         // El servidor Socket toma como argumento a un servidor HTTP existente, al cual se conecta
    const socketServer = new Server(httpServer);        // Creamos un nuevo objeto servidor de Socket y lo guardamos en una variable. El objeto es una representacion del servidor socket. 
 
 // Creamos en nuevo servidor de Socket y lo guardamos en una variable. Le pasamos al servidor de socket el servidor de HTTP.
 // Toda la configuracion de a partir de esta linea es la del Backend.
   
 /* socketServer.on es para cuando llega un Mensaje
 socketServer.emit es para enviar un msj. */
 
 
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
  
      socket.on("msg_front_to_back", async (msg) => {               // Recivimos lo que emitio front, el nombre tiene que ser igual que el del emit del front para escucharlo en este caso "msj_front_to_back".
        const msgCreated = await ChatModel.create(msg);             // En caso de que los datos ingresados estuvieran correctos, usamos ChatModdel  
        const messages = await ChatModel.find({});
         // Cuando respondemos con socketServer les respondemos a todos los socket, a diferencia de usar socket solametne,
        socketServer.emit("msg_back_to_front", messages);           //Le enviamos el array con mensajes a todos  
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

