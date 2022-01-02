import { PrismaClient } from "@prisma/client";
import { institution, users, courses } from "./config/seed-data";
import { generate } from "../lib/bcrypt";
const prisma = new PrismaClient();

const main = async () => {
  console.log("🚀 Starting seed...", "\n");

  // ------------------------------------------------------------
  // Institution
  // ------------------------------------------------------------
  const institutionData = await prisma.institution.upsert({
    where: {
      id: "institution",
    },
    update: { ...institution },
    create: { ...institution },
  });
  console.log(`🏫 Institution "${institutionData.name}" created: `);
  console.log(institutionData, "\n");

  // ------------------------------------------------------------
  // Courses
  // ------------------------------------------------------------
  const courseIds: string[] = [];
  courses.forEach(async (course, i) => {
    const { settings, ...rest } = course;

    const professor = await prisma.user.create({
      data: {
        firstName: `Owner of ${course.name}`,
        lastName: `Professor ${i}`,
        birthDate: new Date("2000-01-01"),
        email: `professorowner${i}@eclass.com`,
        profileImageUrl: `https://avatars.dicebear.com/api/bottts/owner-${i}.svg`,
        role: "professor",
        password: await generate("professor"),
      },
    });

    const courseData = await prisma.course.create({
      data: {
        ...rest,
        owner: { connect: { id: professor.id } },
        settings: { create: settings },
      },
    });

    courseIds.push(courseData.id);
    console.log(`📚 Course "${courseData.name}" created: `);
    console.log(courseData, "\n");

    const enrollment = await prisma.courseMember.create({
      data: {
        course: {
          connect: {
            id: courseData.id,
          },
        },
        user: {
          connect: {
            id: professor.id,
          },
        },
      },
      select: {
        course: true,
        user: true,
      },
    });

    console.log(
      `🎓 Enrolled "${enrollment.user.firstName} ${enrollment.user.lastName}" in "${enrollment.course.name}"`
    );
  });

  // ------------------------------------------------------------
  // Users
  // ------------------------------------------------------------
  users.forEach(async (user) => {
    const { password, ...rest } = user;
    const userData = await prisma.user.create({
      data: { ...rest, password: await generate(password) },
    });

    console.log(
      `🙎 User "${userData.firstName} ${userData.lastName} [${userData.role}]" created: `
    );
    console.log(userData, "\n");

    if (userData.role === "student") {
      for (const courseId of courseIds) {
        const enrollment = await prisma.courseMember.create({
          data: {
            course: {
              connect: {
                id: courseId,
              },
            },
            user: {
              connect: {
                id: userData.id,
              },
            },
          },
          select: {
            course: true,
            user: true,
          },
        });
        console.log(
          `🎓 Enrolled "${enrollment.user.firstName} ${enrollment.user.lastName}" in "${enrollment.course.name}"`
        );
      }
    }
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
