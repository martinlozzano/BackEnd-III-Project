import { RouterClass } from "./routerClass.js"
import { UserController } from "../controllers/users.controller.js"

const {
    getUsers,
    getUserBy,
    createUser,
    updateUsers,
    deleteUsers
} = new UserController()

export class UserRouter extends RouterClass {
    init(){
        this.get("/", ["ADMIN"], getUsers)
        this.get("/:uid", ["ADMIN"], getUserBy)
        this.post("/", ["ADMIN"], createUser)
        this.put("/:uid", ["ADMIN"], updateUsers)
        this.delete("/:uid", ["ADMIN"], deleteUsers)
    }
} 