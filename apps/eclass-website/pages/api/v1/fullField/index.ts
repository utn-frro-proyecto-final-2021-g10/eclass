import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getFullFields();
    case "POST":
      return createFullField();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }

  // gets all fullFields
  async function getFullFields() {
    const fullFields = await prisma.fullField.findMany();
    if (fullFields)
      return res.status(200).json({
        success: true,
        fullFields: fullFields,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron campos completos",
    });
  }
  // creates an fullField
  async function createFullField() {
    if (req.body) {
      try {
        const fullField = await prisma.fullField.create({
          data: req.body,
        });
        return res.status(200).json({
          success: true,
          fullField: fullField,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message:
            env === "development"
              ? error.message
              : "Error al crear el campo completo",
        });
      }
    }
  }
}

export default protect(handler);
