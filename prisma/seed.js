// import { PrismaClient, User } from "@prisma/client";
// import { faker } from "@faker-js/faker";

const { PrismaClient, User } = require("@prisma/client");
const faker = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
    await prisma.user.deleteMany({}); // use with caution.

    const amountOfUsers = 30;
    const users = []


    for (let i = 0; i < amountOfUsers; i++) {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()

        const user = {
            email: faker.internet.email(firstName, lastName),
            firstName,
            lastName,

        };
        users.push(user);
    }

    const addUsers = async () => await prisma.user.createMany({ data: users });

    addUsers();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });