import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getReplies();
    case "POST":
      return createReply();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }

  // gets all replies
  async function getReplies() {
    const replies = await prisma.reply.findMany();
    if (replies)
      return res.status(200).json({
        success: true,
        replies: replies,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron respuestas",
    });
  }
  // creates an reply
  async function createReply() {
    if (req.body) {
      try {
        const reply = await prisma.reply.create({
          data: req.body,
        });
        return res.status(200).json({
          success: true,
          reply: reply,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message:
            env === "development"
              ? error.message
              : "Error al crear la respuesta",
        });
      }
    }
  }
}

export default protect(handler);
