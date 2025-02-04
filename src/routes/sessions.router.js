import { Router } from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { UsersDaoMongo } from "../dao/UsersDao.MongoDB.js"
import { createHash, isValidPassword } from "../utils/bcrypt.js"
import passport from "passport"
import {generateToken} from "../utils/jsonwebtoken.js"
import { passportCall } from "../utils/passport/passportCall.js"

export const router = Router()

const usersDaoMongo = new UsersDaoMongo()

//REGISTER Y LOGIN CON PASSPORT

router.post("/register", passport.authenticate("register", {failureRedirect: "/failRegister"}), async(req, res) =>{
    console.log("se registro")
    res.send({status: "success", message: "Registro completado."})
})

router.get("/failRegister", async(req, res) =>{
    console.log("Fallo la estrategia")
    res.send({status: "error", error:"Fallo estrategia."})
})

router.post("/login", passport.authenticate("login" ,{failureRedirect: "/failedLogin"}), async(req, res) =>{
    if(!req.user) return res.status(401).send({error: "Credenciales invalidas."})

    const userFound = await usersDaoMongo.getBy({email: req.user.email})

    if(!userFound){
        return res.status(401).send({status: "error", error: "User not found."})
    }
    
    /* req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
    } */

    const token = generateToken({id: userFound._id, role: userFound.role})

    res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }).status(200).send({status: "succes", data: userFound, token})
})
router.get("/failedLogin", async(req, res) =>{
    console.log("Fallo la estrategia")
    res.send({status: "error", error: "Fallo estrategia."})
})


router.get("/current", passportCall("current"), (req, res) => {
    res.send({dataUser: req.user, message: "datos sensibles"})
})

router.get("/logout", (req, res) => {
    res.clearCookie("token")
    res.send("Logout")
})

router.post("/changepass", async(req, res) => {
    const { email, newPassword } = req.body
    
    if(!email || !newPassword){
        return res.status(401).send({error: `Los campos email y contrañea nueva son obligatorios.`})
    }
    
    const userFound = await usersDaoMongo.getBy({email})
    
    if(!userFound){
        return res.status(401).send({error: `El usuario no existe.`})
    }
    
    const passwordChanged = {password: createHash(newPassword)}
    
    try {
        const result = await usersDaoMongo.update({email}, passwordChanged)
        res.status(200).send(`Contraseña cambiada con exito.`)
        
    } catch (error) {
        res.setHeader("Content-Type", "application/json")
        res.status(500).send({
            error: "Error inesperado en el servidor.",
            detalle: `${error.message}`
        })
    }
})

/* router.get("/current", passport.authenticate("current", {session: false}), (req, res) => {
    res.send({dataUser: req.user, message: "datos sensibles"})
}) */


    

//REGISTER Y LOGIN SIN PASSPORT

/* router.post("/register", async(req, res) => {
    const {first_name, last_name, email, password, age, cart, role} = req.body
    
    if(!email || !password){
        return res.status(400).send({status: "error", error: "Email y password son obligatorios."})
    }
    
    const userFound = await UsersManager.getUser({email})
    
    if(userFound){
        return res. status(401).send({status: "error", error: "El email ya se encuentra registrado."})
    }
    
    const newUser = {
        first_name,
        last_name,
        email,
        password: createHash(password),
        age,
        cart,
        role
    }
    
    try {
        const result = await UsersManager.createUser(newUser)
        res.status(200).send("Usuario registrado con exito.")
    } catch (error) {
        res.status(500).send({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }
})

router.post("/login", async(req, res) => {
    const { email, password } = req.body
    
    const userFound = await UsersManager.getUser({email})
    
    if(!userFound || !isValidPassword(userFound.password, password)){
        return res.status(401).send({status: "error", error: "Credenciales incorrectas."})
    }
    
    req.session.user = {
        email,
        isAdmin: userFound.role === "admin"
    } 
    
    const token = generateToken({id: userFound._id, role: userFound.role})
    
    res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }).send({status: "succes", data: userFound, token})
}) */




