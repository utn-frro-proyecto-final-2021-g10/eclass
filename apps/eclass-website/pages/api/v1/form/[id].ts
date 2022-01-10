import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getFormById();
    case "PUT":
      return updateForm();
    case "DELETE":
      return deleteForm();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }
  // Finds an form given an form id
  async function getFormById() {
    const form = await prisma.form.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (form) {
      return res.status(200).json({
        success: true,
        form: form,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Formulario no encontrada",
    });
  }
  /// updates an form given an form in the body of the request
  async function updateForm() {
    if (req.body) {
      try {
        const form = await prisma.form.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (form) {
          return res.status(200).json({
            success: true,
            form: form,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar formulario",
        });
      }
    }
  }

  // deletes an form given an id
  async function deleteForm() {
    try {
      const form = await prisma.form.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        form: form,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar formulario",
      });
    }
  }
};

export default protect(handler);
