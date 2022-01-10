import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getForms();
    case "POST":
      return createForm();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }

  // gets all forms
  async function getForms() {
    const forms = await prisma.form.findMany();
    if (forms)
      return res.status(200).json({
        success: true,
        forms: forms,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron formularios",
    });
  }
  // creates an form
  async function createForm() {
    if (req.body) {
      try {
        const form = await prisma.form.create({
          data: req.body
        });
        return res.status(200).json({
          success: true,
          form: form,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: env === 'development' ? error.message :  "Error al crear el formulario",
        });
      }
    }
  }
}

export default protect(handler);
