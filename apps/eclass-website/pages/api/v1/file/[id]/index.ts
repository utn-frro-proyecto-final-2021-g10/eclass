import type { NextApiResponse } from "next";
import { protect } from "../../../../../middleware/protect";
import { reqWithUser } from "../../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getFileById();
    case "PUT":
      return updateFile();
    case "DELETE":
      return deleteFile();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }
  // Finds an file given an file id
  async function getFileById() {
    const file = await prisma.file.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (file) {
      return res.status(200).json({
        success: true,
        file: file,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Archivo no encontrada",
    });
  }
  /// updates a file given a file in the body of the request
  async function updateFile() {
    if (req.body) {
      try {
        const file = await prisma.file.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (file) {
          return res.status(200).json({
            success: true,
            file: file,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar archivo",
        });
      }
    }
  }

  // deletes an file given an id
  async function deleteFile() {
    try {
      const file = await prisma.file.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        file: file,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar archivo",
      });
    }
  }
};

export default protect(handler);
