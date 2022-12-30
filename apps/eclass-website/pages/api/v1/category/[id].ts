import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getCategoryById();
    case "PUT":
      return updateCategory();
    case "DELETE":
      return deleteCategory();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }

  // Finds a category given an category id
  async function getCategoryById() {
    const category = await prisma.category.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (category) {
      return res.status(200).json({
        success: true,
        category: category,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Categoria no encontrada",
    });
  }

  // updates a category given a category in the body of the request
  async function updateCategory() {
    if (req.body) {
      try {
        const category = await prisma.category.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (category) {
          return res.status(200).json({
            success: true,
            category: category,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar categoria",
        });
      }
    }
  }

  // deletes a category given an id
  async function deleteCategory() {
    try {
      const category = await prisma.category.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        category: category,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar categoria",
      });
    }
  }
};

export default protect(handler);
