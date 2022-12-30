import type { NextApiResponse } from "next";
import { protect } from "../../../../../../middleware/protect";
import { reqWithUser } from "../../../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  let userId = req.query.userId.toString();
  let taskId = req.query.taskId.toString();
  switch (req.method) {
    case "GET":
      return getAnswerById();
    case "PUT":
      return updateAnswer();
    case "DELETE":
      return deleteAnswer();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }

  // Finds an answer given an answer id
  async function getAnswerById() {
    const answer = await prisma.answer.findUnique({
      where: {
        userId_taskId: { userId, taskId },
      },
      include: {
        task: true,
        fields: true,
        user: true,
      },
    });

    if (answer) {
      return res.status(200).json({
        success: true,
        answer: answer,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Respuesta no encontrada",
    });
  }

  // updates an answer given an answer in the body of the request
  async function updateAnswer() {
    if (req.body) {
      try {
        const answer = await prisma.answer.upsert({
          where: {
            userId_taskId: { userId, taskId },
          },
          update: req.body,
          create: req.body,
        });
        if (answer) {
          return res.status(200).json({
            success: true,
            answer: answer,
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          success: false,
          message: "Error al modificar respuesta",
        });
      }
    }
  }

  // deletes an answer given an id
  async function deleteAnswer() {
    try {
      const answer = await prisma.answer.delete({
        where: {
          userId_taskId: { userId, taskId },
        },
      });
      return res.status(200).json({
        success: true,
        answer: answer,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar institucion",
      });
    }
  }
};

export default protect(handler);
