import type { NextApiResponse } from "next";
import { reqWithUser } from "../../../../types/reqWithUser";
import { prisma } from "../../../../lib/prisma";
import { protect } from "../../../../middleware/protect";

const enroll = async (req: reqWithUser, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    if (req.body?.enrollmentId) {
      const course = await prisma.course.findUnique({
        where: {
          enrollmentId: req.body.enrollmentId,
        },
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Incorrect enrollment id",
        });
      }

      if (req.user.role === "admin") {
        return res.status(400).json({
          success: false,
          message: "You are an admin, you can't enroll in a course",
        });
      }

      const alreadyEnrolled = await prisma.courseMember.findFirst({
        where: {
          userId: req.user.id,
          courseId: course.id,
        },
      });

      if (alreadyEnrolled) {
        return res.status(400).json({
          success: false,
          message: `Already enrolled to ${course.name}`,
        });
      }

      const enrollment = await prisma.courseMember.create({
        data: {
          course: {
            connect: {
              id: course.id,
            },
          },
          user: {
            connect: {
              id: req.user.id,
            },
          },
        },
      });
      return res.status(200).json({
        success: true,
        enrollment,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Enrollment id is required",
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default protect(enroll);
