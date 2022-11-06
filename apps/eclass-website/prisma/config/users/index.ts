import type { PrismaClient } from "@prisma/client";
import { users } from "./data";
import { generate } from "../../../lib/bcrypt";

export const createUsers = async (
  prisma: PrismaClient,
  courseIds: string[]
) => {
  const students: any[] = [];

  const studentInitialID = 44000;

  await Promise.all(
    users.map(async (user, i) => {
      const { password, ...rest } = user;
      const userData = await prisma.user.create({
        data: {
          ...rest,
          password: await generate(password),
          institutionIdentifier: (studentInitialID + i).toString(),
        },
      });

      console.log(
        `🙎 User "${userData.firstName} ${userData.lastName} - ${userData.role}" created: `
      );
      console.table(userData);
      console.log("\n");

      if (userData.role === "student") {
        students.push(userData);
      }
    })
  );

  await Promise.all(
    students.map(async (student) => {
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
                id: student.id,
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
    })
  );
};
