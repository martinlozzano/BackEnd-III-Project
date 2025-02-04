import { isValidObjectId } from "mongoose"
import { ticketService } from "../services/index.js"
import { CartsDaoMongo } from "../dao/CartsDao.MongoDB.js"

const cartsDaoMongo = new CartsDaoMongo()

export class TicketController {
    constructor(){
        this.service = ticketService
    }

    getTickets = async (req, res) => {
        try{
            let tickets = await this.service.getTickets()

            res.setHeader("Content-Type", "application/json")
            return res.status(200).json(tickets) 
        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }

    getTicketBy = async (req, res) =>{
        let { tid } = req.params

        if(!isValidObjectId(tid)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de id inválido."})
        }

        try {
            let ticket = await this.service.getTicketBy(tid)

            if (!ticket) {
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({ error: `No existe el ticket con el id: ${pid}` })
            }
            res.setHeader("Content-Type", "application/json")
            return res.status(200).json(ticket)
        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            return res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }

    createTicket = async (req, res) =>{

        let { cid } = req.params

        if(!isValidObjectId(cid)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de id inválido."})
        }


        try {
            let tickets = await this.service.getTickets()
            let codigo = 1
            if (tickets.length > 0){
                codigo = Math.max(...tickets.map(d=>d.code)) + 1
            }

            let cart = await cartsDaoMongo.getBy({_id: cid})
            let precio_total = 0

            cart.products.map(prod => {
                if(prod.product.stock >= prod.quantity){
                    precio_total += prod.product.price
                }
            })

            if(precio_total === 0){
                return res.status(400).send({status: "error", error: "No hay en stock ningun articulo."})
            }
    
            let newTicket = {
                code: codigo,
                amount: precio_total
            }

            let ticketNuevo = await this.service.createTicket(newTicket)

            res.setHeader("Content-Type", "application/json")
            return res.status(200).json(ticketNuevo)
            
        } catch (error) {
            console.log(error)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }

    updateTicket = async (req, res) =>{

    }

    deleteTicket = async (req, res) =>{

    }
}