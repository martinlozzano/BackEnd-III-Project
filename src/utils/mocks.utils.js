import { faker } from "@faker-js/faker";
import { createHash } from "./bcrypt.js"

const createMockProduct = () => {
    const title = faker.commerce.productName()
    const descripion = faker.commerce.productDescription()
    const stock = faker.number.int({min: 20, max: 500, multipleOf: 5})
    const price = faker.number.float({min: 1000, max: 30000, multipleOf: 5})
    const image = faker.image.urlPicsumPhotos({width: 500, height: 500})
    const category = ""
    const code =  faker.number.hex({min: 1 , max: 1000000000})
    
    return {title, descripion, stock, price, image, category, code}
}

const createMockUser = () => {
    const first_name = faker.person.firstName()
    const last_name = faker.person.lastName()
    const email = `${first_name + last_name}@gmail.com`
    const age = faker.number.int({min: 18, max: 99})
    const password = createHash("coder123")

    return {first_name, last_name, email, age, password}
}

export { createMockProduct, createMockUser}