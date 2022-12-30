import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getNovelties();
    case "POST":
      return createNovelty();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }

  // gets all novelties
  async function getNovelties() {
    const novelties = await prisma.novelty.findMany({ orderBy: { date: "desc" } });
    if (novelties)
      return res.status(200).json({
        success: true,
        novelties: novelties,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron novedades",
    });
  }

  // creates an novelty
  async function createNovelty() {
    if (req.body) {
      try {
        const novelty = await prisma.novelty.create({
          data: {
            ...req.body,
            date: new Date(),
          }
        });
        return res.status(200).json({
          success: true,
          novelty: novelty,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message:
            env === "development" ? error.message : "Error al crear el novedad",
        });
      }
    }
  }
}

export default protect(handler);
