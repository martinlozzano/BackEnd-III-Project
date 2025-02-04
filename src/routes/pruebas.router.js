import { Router } from "express"

export const router = Router()

//Cookies sin firmar
/* router.get("/setcookie", (req, res) => {
    res.cookie('coderCookie', 'Esta es una cookie muy poderosa', {maxAge: 10000}).send('set cookie')
}) */

/* router.get("/getcookie", (req, res) => {
    res.send(req.cookies)
}) */
   
router.get("/deletecookie", (req, res) => {
    res.clearCookie("coderCookie").send("cookie borrada")
 })


//Cookies firmadas
router.get("/setcookiesigned", (req, res) => {
     res.cookie('coderCookie', 'Esta es una cookie muy poderosa', {maxAge: 1000000, signed: true}).send('set cookie')
})

router.get("/getcookiesigned", (req, res) => {
    res.send(req.signedCookies)
})

//Probando session

router.get("/session", (req, res) => {
    if(req.session.counter){
        req.session.counter ++
        res.send(`Se ha visitado el sitio ${req.session.counter} veces`)
    } else{
        req.session.counter = 1
        res.send(`Bienvenidos`)
    }
})
