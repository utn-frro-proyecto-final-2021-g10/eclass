import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getNoveltyById();
    case "PUT":
      return updateNovelty();
    case "DELETE":
      return deleteNovelty();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }
  // Finds an novelty given an novelty id
  async function getNoveltyById() {
    const novelty = await prisma.novelty.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (novelty) {
      return res.status(200).json({
        success: true,
        novelty: novelty,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Novedad no encontrada",
    });
  }
  /// updates an novelty given an novelty in the body of the request
  async function updateNovelty() {
    if (req.body) {
      try {
        const novelty = await prisma.novelty.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (novelty) {
          return res.status(200).json({
            success: true,
            novelty: novelty,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar novedad",
        });
      }
    }
  }

  // deletes an novelty given an id
  async function deleteNovelty() {
    try {
      const novelty = await prisma.novelty.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        novelty: novelty,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar novedad",
      });
    }
  }
};

export default protect(handler);
