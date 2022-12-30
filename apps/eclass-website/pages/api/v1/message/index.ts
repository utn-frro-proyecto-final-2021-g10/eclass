import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getMessages();
    case "POST":
      return createMessage();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }

  // gets all messages
  async function getMessages() {
    const messages = await prisma.message.findMany();
    if (messages)
      return res.status(200).json({
        success: true,
        messages: messages,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron mensajes",
    });
  }
  // creates an message
  async function createMessage() {
    if (req.body) {
      try {
        const message = await prisma.message.create({
          data: req.body,
        });
        return res.status(200).json({
          success: true,
          message: message,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message:
            env === "development" ? error.message : "Error al crear el mensaje",
        });
      }
    }
  }
}

export default protect(handler);
