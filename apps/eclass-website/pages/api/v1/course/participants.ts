import { transformDocument } from "@prisma/client/runtime";
import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
import userOwnsCourse from "../../../../utils/userOwnsCourse";

async function handler(req: reqWithUser, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(400).json({
      success: false,
      message: "Metodo no permitido",
    });
  }

  const course = await prisma.course.findUnique({
    where: {
      id: req.query.courseId.toString(),
    },
    include: {
      members: true,
    },
  });
  if (course) {
    if (
      course?.members.map((m) => m.userId).includes(req.user.id) ||
      await userOwnsCourse(req.user.id, course?.id)
    ) {
      return res.status(200).json({
        success: true,
        members: course?.members,
      });
    }
    return res.status(401).json({
      success: false,
      message: "Usuario no pertenece al curso",
    });
  }
}

export default protect(handler)