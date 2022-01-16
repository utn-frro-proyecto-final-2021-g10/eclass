import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
import userIsInCourse from "../../../../utils/userIsInCourse";
import userOwnsCourse from "../../../../utils/userOwnsCourse";

async function handler(req: reqWithUser, res: NextApiResponse) {
  if (req.method !== "GET"){
    return res.status(401).json({
      success: false,
      message: "Metodo no permitido"
    })
  }

  if (
    await userIsInCourse(req.user.id, req.query.courseId.toString()) ||
    await userOwnsCourse(req.user.id, req.query.courseId.toString())
     ){
    const tasks = await prisma.task.findMany({
      where:{
        courseId: req.query.courseId.toString()
      }
    });
    if (tasks){
      return res.status(200).json({
        success: true,
        tasks: tasks,
      });
    }
    else {
      return res.status(404).json({
        success: false,
        message: "Tareas no encontradas"
      })
    }
  }
  return res.status(401).json({
    success: false,
    message: "Usuario no esta dentor del curso"
  })
}

export default protect(handler)