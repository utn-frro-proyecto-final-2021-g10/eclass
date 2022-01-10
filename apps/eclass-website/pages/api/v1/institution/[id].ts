import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getInstitutionById();
    case "PUT":
      return updateInstitution();
    case "DELETE":
      return deleteInstitution();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }
  // Finds an institution given an institution id
  async function getInstitutionById() {
    const institution = await prisma.institution.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (institution) {
      return res.status(200).json({
        success: true,
        institution: institution,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Institucion no encontrada",
    });
  }
  /// updates an institution given an institution in the body of the request
  async function updateInstitution() {
    if (req.body) {
      try {
        const institution = await prisma.institution.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (institution) {
          return res.status(200).json({
            success: true,
            institution: institution,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar institucion",
        });
      }
    }
  }

  // deletes an institution given an id
  async function deleteInstitution() {
    try {
      const institution = await prisma.institution.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        institution: institution,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar institucion",
      });
    }
  }
};

export default protect(handler);
