import { TicketMongo } from "../DAO/mongo/tickets.mongo.js";
const ticketMongo = new TicketMongo();

export class TicketService {
    async createTicket(code, amount, purchaser) {
        try {
            const newTicket = await ticketMongo.createTicket({ code, amount, purchaser });
            return newTicket;
        } catch (error) {
            throw new Error('Error creating ticket: ' + error.message);
        }
    }
}
