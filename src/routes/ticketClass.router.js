import { RouterClass } from "./routerClass.js"
import { TicketController } from "../controllers/tickets.controller.js"

const {
    getTickets,
    getTicketBy,
    createTicket,
    updateTicket,
    deleteTicket,
} = new TicketController()

export class TicketRouter extends RouterClass {
    init(){
        this.get("/", ["PUBLIC"], getTickets)
        this.get("/:tid", ["PUBLIC"], getTicketBy)
        this.post("/:cid", ["PUBLIC"], createTicket)
        this.put("/:tid", ["PUBLIC"], updateTicket)
        this.delete("/:tid", ["PUBLIC"], deleteTicket)
    }
} 