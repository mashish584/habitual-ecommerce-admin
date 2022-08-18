import { PrismaClient } from "@prisma/client";
import ProductJSON from "./productsSeed";

const prisma = new PrismaClient();

const seed = () => {
  const inserts = ProductJSON.map((product) => prisma.product.create({ data: product }));

  return Promise.all(inserts);
};

seed()
  .catch((e) => {
    console.log({ e });
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
