import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getCategories();
    case "POST":
      return createCategory();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }

  // gets all Categories
  async function getCategories() {
    const categories = await prisma.category.findMany();
    if (categories)
      return res.status(200).json({
        success: true,
        categories: categories,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron categorias",
    });
  }
  // creates an category
  async function createCategory() {
    if (req.body) {
      try {
        const category = await prisma.category.create({
          data: req.body
        });
        return res.status(200).json({
          success: true,
          category: category,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: env === 'development' ? error.message :  "Error al crear la categoria",
        });
      }
    }
  }
}

export default protect(handler);
