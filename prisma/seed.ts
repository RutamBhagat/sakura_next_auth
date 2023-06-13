import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const userLaith = await prisma.user.create({
    data: {
      name: "Laith",
      email: "laith@gmail.com",
      password: "$2b$10$I8xkU2nQ8EAHuVOdbMy9YO/.rSU3584Y.H4LrpIujGNDtmny9FnLu",
    },
  });

  const userJosh = await prisma.user.create({
    data: {
      name: "Josh",
      email: "josh@gmail.com",
      password: "$2b$10$I8xkU2nQ8EAHuVOdbMy9YO/.rSU3584Y.H4LrpIujGNDtmny9FnLu",
    },
  });

  const userLebron = await prisma.user.create({
    data: {
      name: "Lebron",
      email: "lebron@gmail.com",
      password: "$2b$10$I8xkU2nQ8EAHuVOdbMy9YO/.rSU3584Y.H4LrpIujGNDtmny9FnLu",
    },
  });

  const userCassidy = await prisma.user.create({
    data: {
      name: "Cassidy",
      email: "cassidy@gmail.com",
      password: "$2b$10$I8xkU2nQ8EAHuVOdbMy9YO/.rSU3584Y.H4LrpIujGNDtmny9FnLu",
    },
  });
  console.log("Seed successful");
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
