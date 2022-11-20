import { PrismaClient } from "@prisma/client";
import { createInstitution } from "./config/institution";
import { createNovelties } from "./config/novelties";
import { createCourses } from "./config/courses";
import { createUsers } from "./config/users";

const prisma = new PrismaClient();

const logStep = (step: string) => {
  console.log(
    "\n----------------------------------------\n",
    step,
    "\n----------------------------------------\n"
  );
};

const main = async () => {
  console.log("🚀 Starting seed...", "\n");

  logStep("🏫 Creating institution");
  await createInstitution(prisma);

  logStep("ℹ️ Creating novelties");
  await createNovelties(prisma);

  logStep("📚 Creating courses");
  const courseIds = await createCourses(prisma);

  logStep("🙎 Creating users");
  await createUsers(prisma, courseIds);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
