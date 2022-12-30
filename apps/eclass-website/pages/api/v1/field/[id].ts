import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getFieldById();
    case "PUT":
      return updateField();
    case "DELETE":
      return deleteField();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }
  // Finds an field given an field id
  async function getFieldById() {
    const field = await prisma.field.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (field) {
      return res.status(200).json({
        success: true,
        field: field,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Campo no encontrado",
    });
  }
  /// updates an field given an field in the body of the request
  async function updateField() {
    if (req.body) {
      try {
        const field = await prisma.field.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (field) {
          return res.status(200).json({
            success: true,
            field: field,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar campo",
        });
      }
    }
  }

  // deletes an field given an id
  async function deleteField() {
    try {
      const field = await prisma.field.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        field: field,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar campo",
      });
    }
  }
};

export default protect(handler);
