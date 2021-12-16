import { PrismaClient } from "@prisma/client";
import { institution, users } from "./config/seed-data";
import { generate } from "../lib/bcrypt";
const prisma = new PrismaClient();

const main = async () => {
  console.log("🚀 Starting seed...", "\n");

  const institutionData = await prisma.institution.upsert({
    where: {
      id: "institution",
    },
    update: { ...institution },
    create: { ...institution },
  });
  console.log(`🏫 Institution "${institution.name}" created: `);
  console.log(institutionData, "\n");

  users.forEach(async (user) => {
    const { password, ...rest } = user;
    const userData = await prisma.user.create({
      data: { ...rest, password: await generate(password) },
    });
    console.log(
      `🙎 User "${user.firstName} ${user.lastName} [${user.role}]" created: `
    );
    console.log(userData, "\n");
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
