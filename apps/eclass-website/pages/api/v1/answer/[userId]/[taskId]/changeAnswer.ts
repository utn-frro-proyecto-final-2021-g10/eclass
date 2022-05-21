import type { NextApiResponse } from "next";
import { protect } from "../../../../../../middleware/protect";
import { reqWithUser } from "../../../../../../types/reqWithUser";
const env = process.env.NODE_ENV;
const handler = async (req: reqWithUser, res: NextApiResponse) => {
  let userId = req.query.userId.toString();
  let taskId = req.query.taskId.toString();
  switch (req.method) {
    case "POST":
      return changeAnswer();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }
  // Finds an answer given an answer id
  async function changeAnswer() {
    try {
      const answer = await prisma.answer.delete({
        where: {
          userId_taskId: { userId, taskId },
        },
      });
    } catch (error: any) {}

    try {
      const answer = await prisma.answer.upsert({
        where: {
          userId_taskId: { userId: req.body.userId, taskId: req.body.taskId },
        },
        create: req.body,
        update: req.body,
      });
      return res.status(200).json({
        success: true,
        answer: answer,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message:
          env === "development" ? error.message : "Error al crear la respuesta",
      });
    }
  }
};

export default protect(handler);
