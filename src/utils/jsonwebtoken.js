import jwt from "jsonwebtoken"

export const PRIVATE_KEY = "MartinKeySecret@firma"

export const generateToken = (user) => {
    return jwt.sign(user, PRIVATE_KEY, {expiresIn: "1d"})
}

export const authTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"]

    if(!authHeader){
        return res.status(401).send({status: "error", error: "not authenticated"})
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, PRIVATE_KEY, (error, usuarioExtraidoDelToken) => {
        req.user = usuarioExtraidoDelToken
        next()
    })
}  