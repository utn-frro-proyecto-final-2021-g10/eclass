import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getTasks();
    case "POST":
      return createTask();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }

  // gets all tasks
  async function getTasks() {
    const tasks = await prisma.task.findMany();
    if (tasks)
      return res.status(200).json({
        success: true,
        tasks: tasks,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron tareas",
    });
  }
  // creates an task
  async function createTask() {
    if (req.body) {
      try {
        const task = await prisma.task.create({
          data: req.body
        });
        return res.status(200).json({
          success: true,
          task: task,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: env === 'development' ? error.message :  "Error al crear la tarea",
        });
      }
    }
  }
}

export default protect(handler);
