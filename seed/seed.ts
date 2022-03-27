import { PrismaClient } from "@prisma/client";
import ProductJSON from "./products";

const prisma = new PrismaClient();

const seed = () => {
  const inserts = ProductJSON.map((product) => {
    return prisma.product.create({ data: product });
  });

  return Promise.all(inserts);
};

seed()
  .catch((e) => {
    console.log({ e });
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
