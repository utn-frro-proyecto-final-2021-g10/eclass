import type { NextApiResponse } from "next";
import { reqWithUser } from "../../../../../types/reqWithUser";
import { prisma } from "../../../../../lib/prisma";
import { protect } from "../../../../../middleware/protect";
import userIsInCourse from "../../../../../utils/userIsInCourse";
import userOwnsCourse from "../../../../../utils/userOwnsCourse";

const tasksByCourse = async (req: reqWithUser, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }
  if (
    (await userIsInCourse(req.user.id, req.query.id.toString())) ||
    (await userOwnsCourse(req.user.id, req.query.id.toString()))
  ) {
    const tasks = await prisma.task.findMany({
      where: {
        courseId: req.query.id.toString(),
      },
    });
    if (tasks) {
      return res.status(200).json({
        success: true,
        tasks: tasks,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Tareas no encontradas",
      });
    }
  }
  return res.status(401).json({
    success: false,
    message: "Usuario no esta dentro del curso",
  });
};

export default protect(tasksByCourse);
