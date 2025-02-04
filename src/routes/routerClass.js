import jwt from "jsonwebtoken"
import { PRIVATE_KEY } from "../utils/jsonwebtoken.js"
import { Router } from "express"

export class RouterClass {
    constructor(){
        this.router = new Router()
        this.init()
    }
    
    getRouter(){
        return this.router
    }

    init(){}

    applyCallback (callbacks) {
        return callbacks.map(cb => async (...params) => {
            try {
                await cb.apply(this, params)
                
            } catch (error) {
                params[1].status(500).send(error)
            }
        })
    }

    generateCustomResponses (req, res, next){
        res.sendSuccess = payload => res.send({status: "success", payload})
        res.sendServerError = error => res.send({status: "error", error})
        res.sendUserError = error => res.send({status: "error", error})

        next()
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies[0].toUpperCase() === "PUBLIC") return next()
        const authHeaders = req.headers.authorization

        if(!authHeaders) return res.status(401).send({status: "error", error: "not permissions"})
        
        const token = authHeaders.split(" ")[1]
        let user = jwt.verify(token, PRIVATE_KEY)

        req.user = user

        next()
    }

    get (path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallback(callbacks))   
    }
    
    post (path, policies, ...callbacks) {
        this.router.post(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallback(callbacks))   
    }
    
    put (path, policies, ...callbacks) {
        this.router.put(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallback(callbacks))   
    }
    
    delete (path, policies, ...callbacks) {
        this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallback(callbacks))   
    }
    
} 