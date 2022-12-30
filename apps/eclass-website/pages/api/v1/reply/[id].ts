import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getReplyById();
    case "PUT":
      return updateReply();
    case "DELETE":
      return deleteReply();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }
  // Finds an reply given an reply id
  async function getReplyById() {
    const reply = await prisma.reply.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (reply) {
      return res.status(200).json({
        success: true,
        reply: reply,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Respuesta no encontrada",
    });
  }
  // updates an reply given an reply in the body of the request
  async function updateReply() {
    if (req.body) {
      try {
        const reply = await prisma.reply.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (reply) {
          return res.status(200).json({
            success: true,
            reply: reply,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar respuesta",
        });
      }
    }
  }

  // deletes an reply given an id
  async function deleteReply() {
    try {
      const reply = await prisma.reply.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        reply: reply,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar respuesta",
      });
    }
  }
};

export default protect(handler);
