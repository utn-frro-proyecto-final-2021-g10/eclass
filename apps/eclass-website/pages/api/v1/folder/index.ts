import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getFolders();
    case "POST":
      return createFolder();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }

  // gets all Categories
  async function getFolders() {
    const categories = await prisma.folder.findMany();
    if (categories)
      return res.status(200).json({
        success: true,
        categories: categories,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron carpetas",
    });
  }

  // creates a folder
  async function createFolder() {
    if (req.body) {
      try {
        const folder = await prisma.folder.create({
          data: {
            ...req.body,
            professor: {
              connect: {
                id: req.user.id,
              },
            },
          },
        });
        return res.status(200).json({
          success: true,
          folder: folder,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message:
            env === "development"
              ? error.message
              : "Error al crear la categoria",
        });
      }
    }
  }
}

export default protect(handler);
