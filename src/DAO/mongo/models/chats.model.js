import { Schema, model } from "mongoose";

const schema = new Schema({
  user: { type: String, required: true, max: 100 },
  message: { type: String, required: true, max: 100 },
});
                                                            // Basicamente le decimos que la tabla de message tiene que tener el esquema anterior creado por el constructor "schema"
export const ChatModel = model("messages", schema);          // userModel es ka variable para exportar, "user " seria el nombre de la COLECCTION en la base de datos en Mongo.
