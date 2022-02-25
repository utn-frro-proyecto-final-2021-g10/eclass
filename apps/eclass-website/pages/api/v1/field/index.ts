import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getFields();
    case "POST":
      return createField();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }

  // gets all fields
  async function getFields() {
    const fields = await prisma.field.findMany();
    if (fields)
      return res.status(200).json({
        success: true,
        fields: fields,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron campos",
    });
  }
  // creates an field
  async function createField() {
    if (req.body) {
      try {
        const field = await prisma.field.create({
          data: req.body,
        });
        return res.status(200).json({
          success: true,
          field: field,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message:
            env === "development" ? error.message : "Error al crear el campo",
        });
      }
    }
  }
}

export default protect(handler);
