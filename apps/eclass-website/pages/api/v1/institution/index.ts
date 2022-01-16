import { Role } from "@prisma/client";
import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getInstitutions();
    case "POST":
      return createInstitution();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }

  // gets all institutions
  async function getInstitutions() {
    const institutions = await prisma.institution.findMany();
    if (institutions)
      return res.status(200).json({
        success: true,
        institutions: institutions,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron instituciones",
    });
  }
  // creates an institution
  async function createInstitution() {
    if (req.user.role !== Role.admin){
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }
    if (req.body) {
      try {
        const institution = await prisma.institution.create({
          data: req.body
        });
        return res.status(200).json({
          success: true,
          institution: institution,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: env === 'development' ? error.message :  "Error al crear el usuario",
        });
      }
    }
  }
}

export default protect(handler);
