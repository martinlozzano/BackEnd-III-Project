export const authentication = (req, res, next) =>{
    if (req.session.user.email !== "martinlozzano7@gmail.com" || !req.session.user.isAdmin){
        return res.status(401).send("Error de autenticación")
    }
    next()
}