import type { NextApiResponse } from "next";
import { reqWithUser } from "../../../../../types/reqWithUser";
import { prisma } from "../../../../../lib/prisma";
import { protect } from "../../../../../middleware/protect";

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
          message: "Id de enrolamiento no encontrado",
        });
      }

      if (req.user.role === "admin") {
        return res.status(400).json({
          success: false,
          message: "Un administrador no puede inscribirse a un curso",
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
          message: `Ya estás inscrito en el curso ${course.name}`,
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
        message: "El id de enrolamiento es requerido",
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Algo ha salido mal",
    });
  }
};

export default protect(enroll);
