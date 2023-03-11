import type { PrismaClient } from "@prisma/client";
import { courses } from "./data";
import { generate } from "../../../lib/bcrypt";

export const createCourses = async (prisma: PrismaClient) => {
  const coursesData: any[] = [];
  const enrollmentsData: any[] = [];

  const InitialID = 45000;

  await Promise.all(
    courses.map(async (course, i) => {
      const { settings, ...rest } = course;

      const professor = await prisma.user.create({
        data: {
          firstName: `Dueño de "${course.name}"`,
          lastName: `Profesor ${i}`,
          birthDate: new Date("2000-01-01"),
          institutionIdentifier: (InitialID + i).toString(),
          email: `professorowner${i}@eclass.com`,
          profileImageUrl: `https://avatars.dicebear.com/api/bottts/owner-${i}.svg`,
          role: "professor",
          password: await generate("professor"),
        },
      });

      const forum = await prisma.forum.create({
        data: {
          messages: undefined,
        },
      });

      const courseData = await prisma.course.create({
        data: {
          ...rest,
          forum: {
            connect: {
              id: forum.id,
            },
          },
          owner: { connect: { id: professor.id } },
          settings: { create: settings },
        },
      });

      coursesData.push(courseData);

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

      enrollmentsData.push(enrollment);
    })
  );

  console.log(`📚 Created ${coursesData.length} courses: `);
  coursesData
    .map((course) => {
      return {
        name: course.name,
        slug: course.slug,
        description: course.description,
        enrollmentId: course.enrollmentId,
      };
    })
    .map((course) => {
      console.table(course);
    });
  console.log("\n");
  enrollmentsData.map((enrollment) => {
    console.log(
      `🎓 Enrolled "${enrollment.user.firstName} ${enrollment.user.lastName}" in "${enrollment.course.name}"`
    );
  });

  return coursesData.map((course) => course.id);
};
