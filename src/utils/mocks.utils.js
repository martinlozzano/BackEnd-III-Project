import { faker } from "@faker-js/faker";

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
    const sex = faker.person.sex()
    const name = faker.person.fullName({sex: sex})
    const job_title = faker.person.jobTitle()
    const job_description = faker.person.jobDescriptor()

    return {sex, name, job_title, job_description}
}

export { createMockProduct, createMockUser}