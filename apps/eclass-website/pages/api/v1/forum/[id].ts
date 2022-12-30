import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getForumById();
    case "PUT":
      return updateForum();
    case "DELETE":
      return deleteForum();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }
  // Finds an forum given an forum id
  async function getForumById() {
    const forum = await prisma.forum.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (forum) {
      return res.status(200).json({
        success: true,
        forum: forum,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Foro no encontrado",
    });
  }
  /// updates an forum given an forum in the body of the request
  async function updateForum() {
    if (req.body) {
      try {
        const forum = await prisma.forum.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (forum) {
          return res.status(200).json({
            success: true,
            forum: forum,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar el foro",
        });
      }
    }
  }

  // deletes an forum given an id
  async function deleteForum() {
    try {
      const forum = await prisma.forum.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        forum: forum,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar foro",
      });
    }
  }
};

export default protect(handler);
