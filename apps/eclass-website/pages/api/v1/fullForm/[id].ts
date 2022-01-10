import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getFullFormById();
    case "PUT":
      return updateFullForm();
    case "DELETE":
      return deleteFullForm();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }
  // Finds an fullForm given an fullForm id
  async function getFullFormById() {
    const fullForm = await prisma.fullForm.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (fullForm) {
      return res.status(200).json({
        success: true,
        fullForm: fullForm,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Formulario completo no encontrada",
    });
  }
  /// updates an fullForm given an fullForm in the body of the request
  async function updateFullForm() {
    if (req.body) {
      try {
        const fullForm = await prisma.fullForm.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (fullForm) {
          return res.status(200).json({
            success: true,
            fullForm: fullForm,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar formulario completo",
        });
      }
    }
  }

  // deletes an fullForm given an id
  async function deleteFullForm() {
    try {
      const fullForm = await prisma.fullForm.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        fullForm: fullForm,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar formulario completo",
      });
    }
  }
};

export default protect(handler);
