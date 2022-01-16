import { Role } from "@prisma/client";
import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const env = process.env.NODE_ENV;
function handler(req: reqWithUser, res: NextApiResponse) {
  const unauthorized = res.status(401).json({
    success: false,
    message: "No autorizado"
  })
  switch (req.method) {
    case "GET":
      return getAnswers();
    case "POST":
      return createAnswer();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }

  // gets all answers
  async function getAnswers() {
    const answers = await prisma.answer.findMany();
    if (answers)
      return res.status(200).json({
        success: true,
        answers: answers,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron respuestas",
    });
  }
  // creates an answer
  async function createAnswer() {
    if (req.body) {
      try {
        const answer = await prisma.answer.create({
          data: req.body
        });
        return res.status(200).json({
          success: true,
          answer: answer,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: env === 'development' ? error.message :  "Error al crear la respuesta",
        });
      }
    }
  }
}

export default protect(handler, [Role.admin]);
