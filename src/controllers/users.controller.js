import { UserDto } from "../dto/users.dto.js"
import { userService } from "../services/index.js"

export class UserController {
    constructor(){
        this.service = userService
    }

    getUsers = async (req, res) => {
        try {
            const users = await this.service.getUsers()
            res.status(200).json({users})
            
        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}` 
            })
        }
    }

    getUserBy = async (req, res) => {
        const { uid } = req.params

        try {
            const user = await this.service.getUserby({_id: uid})
            /* const userDto = new UserDto(user) */
            res.status(200).send({status: "success", data: user})
            
        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}` 
            })
        }
    }

    createUser = async (req, res) => {
        const { body } = req

        if(!body.email){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error: `Es necesario que el campo email sea colocado y que sea un string.`})
        }
        if(!body.first_name){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error: `Es necesario que el campo first name sea colocado y que sea un string.`})
        }
    
        try {
            let user = new UserDto(body)
            const result = await this.service.createUser(user)
    
            res.status(200).send({status: "success", data: result})
        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}` 
            })
        }
    }

    updateUsers = async (req, res) => {
        const { uid } = req.params
        const { first_name, last_name, email, age, password, role } = req.body
    
        const userToUpdate = {
            first_name,
            last_name,
            email,
            age,
            password,
            role
        }
    
        try {
            const result = await this.service.updateUser({_id: uid}, userToUpdate)
            res.status(200).send({status: "success", data: result})
        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}` 
            })
        }
    }

    deleteUsers = async (req, res) => {
        const { uid } = req.params
        try {
            const result = await this.service.deleteUser(uid)
            res.status(200).send({status: "success", data: result})
        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}` 
            })
        }
    }

}