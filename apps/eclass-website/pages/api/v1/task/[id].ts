import { Role } from "@prisma/client";
import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
import userIsInCourse from "../../../../utils/userIsInCourse";
import userOwnsCourse from "../../../../utils/userOwnsCourse";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  const unauthorized = res
    .status(401)
    .json({ success: false, message: "Unauthorized" });
  switch (req.method) {
    case "GET":
      return getTaskById();
    case "PUT":
      return updateTask();
    case "DELETE":
      return deleteTask();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }
  // Finds an task given an task id
  async function getTaskById() {
    const task = await prisma.task.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (task) {
      if (
        !(
          (await userIsInCourse(req.user.id, task.courseId)) ||
          (await userOwnsCourse(req.user.id, task.courseId))
        )
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Usuario no pertenece al curso de la tarea ni es dueño del curso",
        });
      }

      return res.status(200).json({
        success: true,
        task: task,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Tarea no encontrada",
    });
  }
  /// updates an task given an task in the body of the request
  async function updateTask() {
    if (req.user.role === Role.student) return unauthorized;
    if (req.body) {
      try {
        const task = await prisma.task.findUnique({
          where: {
            id: req.query.id.toString(),
          },
        });

        if (task) {
          if (!(await userOwnsCourse(req.user.id, task.courseId))) {
            return res.status(401).json({
              success: false,
              message: "El usuario no es dueño de este curso",
            });
          }
        }

        const updatedTask = await prisma.task.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (updatedTask) {
          return res.status(200).json({
            success: true,
            task: updatedTask,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar tarea",
        });
      }
    }
  }

  // deletes an task given an id
  async function deleteTask() {
    if (req.user.role === Role.student) return unauthorized;
    try {
      const task = await prisma.task.findUnique({
        where: {
          id: req.query.id.toString(),
        },
      });

      if (task) {
        if (!(await userOwnsCourse(req.user.id, task.courseId))) {
          return res.status(401).json({
            success: false,
            message: "El usuario no es dueño de este curso",
          });
        }
      }

      const deletedTask = await prisma.task.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        task: deletedTask,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar tarea",
      });
    }
  }
};

export default protect(handler);
