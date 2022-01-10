import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getMessageById();
    case "PUT":
      return updateMessage();
    case "DELETE":
      return deleteMessage();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }
  // Finds an message given an message id
  async function getMessageById() {
    const message = await prisma.message.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (message) {
      return res.status(200).json({
        success: true,
        message: message,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Mensaje no encontrado",
    });
  }
  /// updates an message given an message in the body of the request
  async function updateMessage() {
    if (req.body) {
      try {
        const message = await prisma.message.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (message) {
          return res.status(200).json({
            success: true,
            message: message,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar mensaje",
        });
      }
    }
  }

  // deletes an message given an id
  async function deleteMessage() {
    try {
      const message = await prisma.message.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        message: message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar mensaje",
      });
    }
  }
};

export default protect(handler);
