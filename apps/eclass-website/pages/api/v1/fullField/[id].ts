import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getFullFieldById();
    case "PUT":
      return updateFullField();
    case "DELETE":
      return deleteFullField();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }
  // Finds an fullField given an fullField id
  async function getFullFieldById() {
    const fullField = await prisma.fullField.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (fullField) {
      return res.status(200).json({
        success: true,
        fullField: fullField,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Campo completo no encontrado",
    });
  }
  /// updates an fullField given an fullField in the body of the request
  async function updateFullField() {
    if (req.body) {
      try {
        const fullField = await prisma.fullField.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (fullField) {
          return res.status(200).json({
            success: true,
            fullField: fullField,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar campo completo",
        });
      }
    }
  }

  // deletes an fullField given an id
  async function deleteFullField() {
    try {
      const fullField = await prisma.fullField.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        fullField: fullField,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar campo completo",
      });
    }
  }
};

export default protect(handler);
