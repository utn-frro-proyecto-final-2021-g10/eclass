import type { NextApiResponse } from "next";
import { reqWithUser } from "../../../../types/reqWithUser";
import { prisma } from "../../../../lib/prisma";
import { protect } from "../../../../middleware/protect";

const disenroll = async (req: reqWithUser, res: NextApiResponse) => {
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

      if (course.ownerId === req.user.id) {
        return res.status(403).json({
          success: false,
          message:
            "You are the owner of this course, you cannot disenroll from it",
        });
      }

      await prisma.courseMember.deleteMany({
        where: {
          userId: req.user.id,
          courseId: course.id,
        },
      });
      return res.status(200).json({
        success: true,
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

export default protect(disenroll);
