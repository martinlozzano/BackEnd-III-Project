import express from "express"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import { router as vistasRouter } from "./routes/vistas.router.js"
import { router as sessionsRouter } from "./routes/sessions.router.js"
/* import { router as usersRouter } from "./routes/users.router.js" */
import { router as pruebasRouter } from "./routes/pruebas.router.js"
import connDB from "./data/connDB.js"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"
import { initializePassport } from "./config/passport.config.js"
import { UserRouter } from "./routes/userClass.router.js"
import { ProductRouter } from "./routes/productClass.router.js"
import { CartRouter } from "./routes/cartsClass.router.js"
import { TicketRouter } from "./routes/ticketClass.router.js"
import { MocksRouter } from "./routes/mocks.router.js"
import env from "./utils/env.utils.js"
import loggerUtil from "./utils/logger.util.js"
import errorHandler from "./middlewares/errorHandler.mid.js"
import argsUtils from "./utils/args.utils.js"
import cluster from "cluster"
import {cpus} from "os"
import { log } from "console"
import { loggers } from "winston"

// import FileStore from "session-file-store"

const app = express()
const PORT = env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"))
app.use(cookieParser("palabrasecreta"))

//PASSPORT - JWT
initializePassport()
app.use(passport.initialize())


//PERSISTENCIA DE SESSION CON FILESTORE
/* const fileStore = new FileStore(session)

app.use(session({
    store: new fileStore({
        path: "./src/sessions",
        ttl: 10000,
        retire: 0
    }),
    secret: "secretcoder",
    resave: true,
    saveUninitialized: true
})) */

//PERSISTENCIA DE SESSION CON DB MONGO

app.use(session({
    store: MongoStore.create({
        mongoUrl: env.MONGO_LINK,
        ttl: 100000
    }),
    secret: "secretcoder",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.session())

app.engine("handlebars", engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))
app.set("view engine", "handlebars")
app.set("views", "./src/views")


const userRouter = new UserRouter()
const productRouter = new ProductRouter()
const cartRouter = new CartRouter()
const ticketRouter = new TicketRouter()
const mocksRouter = new MocksRouter()

app.use("/api/sessions/",
    (req, res, next) => {
        req.io=io
        next()
    }, 
    sessionsRouter)

app.use("/api/users/",
    (req, res, next) => {
        req.io=io
        next()
    }, 
    userRouter.getRouter())

app.use("/api/products/", 
    (req, res, next) => {
        req.io=io
        next()
    },
    productRouter.getRouter())

app.use("/api/carts/",
    (req, res, next) => {
        req.io=io
        next()
    },
    cartRouter.getRouter())

app.use("/api/tickets/",
    (req, res, next) => {
        req.io=io
        next()
    },
    ticketRouter.getRouter())

app.use("/api/mocks/",
    (req, res, next) => {
        req.io=io
        next()
    },
    mocksRouter.getRouter())

app.use("/",
    (req, res, next) => {
        req.io=io
        next()
    },
    vistasRouter)

app.use("/pruebas/", pruebasRouter)

app.use(errorHandler)

const ready = async () => {
    const mode = argsUtils.mode
    loggerUtil.INFO(`Server ready on ${mode} mode, on port ${PORT} and on process ${process.pid}`)
    await connDB()
}

const isPrimary = cluster.isPrimary
const numberOfProcess = cpus().length
let serverHttp

if(isPrimary){
    loggerUtil.INFO(`isPrimary: ${process.pid}`)

    for(let index = 1; index <= numberOfProcess; index++){
        cluster.fork()
    } 
} else{
    loggerUtil.INFO(`isWorker: ${process.pid}`)
    serverHttp = app.listen(PORT, ready)
}

let io = new Server(serverHttp)

io.on("connection", socket=>{
    loggerUtil.INFO(`Se ha contectado un cliente con id ${socket.id}`)
})

