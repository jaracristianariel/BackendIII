import { faker } from "@faker-js/faker";

function generateUser() {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(["user", "admin", "courier"])
    }
}

export default generateUser