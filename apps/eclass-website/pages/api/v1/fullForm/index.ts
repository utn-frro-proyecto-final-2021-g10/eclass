import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getFullForms();
    case "POST":
      return createFullForm();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }

  // gets all fullForms
  async function getFullForms() {
    const fullForms = await prisma.fullForm.findMany();
    if (fullForms)
      return res.status(200).json({
        success: true,
        fullForms: fullForms,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron formularios completos",
    });
  }
  // creates an fullForm
  async function createFullForm() {
    if (req.body) {
      try {
        const fullForm = await prisma.fullForm.create({
          data: req.body
        });
        return res.status(200).json({
          success: true,
          fullForm: fullForm,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: env === 'development' ? error.message :  "Error al crear el formulario completo",
        });
      }
    }
  }
}

export default protect(handler);
