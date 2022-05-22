import type { PrismaClient } from "@prisma/client";
import { Institution } from "@prisma/client";

const institution: Institution = {
  id: "institution",
  name: process.env.INSTITUTION_NAME!,
  description: process.env.INSTITUTION_DESCRIPTION!,
  imageUrl: process.env.INSTITUTION_IMAGE_URL!,
  address: process.env.INSTITUTION_ADDRESS!,
  city: process.env.INSTITUTION_CITY!,
  state: process.env.INSTITUTION_STATE!,
  phone: process.env.INSTITUTION_PHONE!,
  email: process.env.INSTITUTION_EMAIL!,
  website: process.env.INSTITUTION_WEBSITE!,
};

export const createInstitution = async (prisma: PrismaClient) => {
  const institutionData = await prisma.institution.upsert({
    where: {
      id: "institution",
    },
    update: { ...institution },
    create: { ...institution },
  });

  console.log(`🏫 Institution "${institutionData.name}" created: `);
  console.table(institutionData);
};
