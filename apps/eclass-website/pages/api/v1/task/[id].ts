import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
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
    if (req.body) {
      try {
        const task = await prisma.task.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (task) {
          return res.status(200).json({
            success: true,
            task: task,
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
    try {
      const task = await prisma.task.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        task: task,
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
