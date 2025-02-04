import express from "express"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import { router as productsRouter} from "./routes/products.router.js"
import { router as cartsRouter} from "./routes/carts.router.js"
import { router as vistasRouter } from "./routes/vistas.router.js"
import { router as sessionsRouter } from "./routes/sessions.router.js"
/* import { router as usersRouter } from "./routes/users.router.js" */
import { router as pruebasRouter } from "./routes/pruebas.router.js"
import { connDB } from "./data/connDB.js"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"
import { initializePassport } from "./config/passport.config.js"
import { UserRouter } from "./routes/userClass.router.js"
import { ProductRouter } from "./routes/productClass.router.js"
import { CartRouter } from "./routes/cartsClass.router.js"
import { TicketRouter } from "./routes/ticketClass.router.js"
// import FileStore from "session-file-store"

const PORT = 8080
const app = express()

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
        mongoUrl: "mongodb+srv://ecommerce:1234@cluster0.tlsjd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
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

app.use("/",
    (req, res, next) => {
        req.io=io
        next()
    },
    vistasRouter)

app.use("/pruebas/", pruebasRouter)

const serverHTTP = app.listen(PORT, () => console.log(`Servidor online en puerto ${PORT}`))

let io = new Server(serverHTTP)

io.on("connection", socket=>{
    console.log(`Se ha contectado un cliente con id ${socket.id}`)
})

connDB()