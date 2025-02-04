export class TicketsRepository{
    constructor(dao){
        this.dao = dao
    }

    getTickets = async () =>{
        return await this.dao.get()
    }

    getTicketBy = async (filter) =>{
        return await this.dao.getBy(filter)
    }
    
    createTicket = async (newTicket) =>{
        return await this.dao.create(newTicket)
    }
    
    updateTicket = async (id, ticketToUpdate) =>{
        return await this.dao.update(id, ticketToUpdate)
    }
    
    deleteTicket = async (id) =>{
        return await this.dao.delete(id)
    }
}