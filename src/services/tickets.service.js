import { TicketMongo } from "../DAO/mongo/tickets.mongo.js";

export class TicketService {
    async createTicket(code, amount, purchaser) {
        try {
            const newTicket = await TicketMongo.createTicket({ code, amount, purchaser });
            return newTicket;
        } catch (error) {
            throw new Error('Error creating ticket: ' + error.message);
        }
    }
}
