import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getFolderById();
    case "PUT":
      return updateFolder();
    case "DELETE":
      return deleteFolder();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }

  // Finds a folder given a folder id
  async function getFolderById() {
    const folder = await prisma.folder.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (folder) {
      return res.status(200).json({
        success: true,
        folder: folder,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Carpeta no encontrada",
    });
  }

  // updates a folder given a folder in the body of the request
  async function updateFolder() {
    if (req.body) {
      try {
        const folder = await prisma.folder.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (folder) {
          return res.status(200).json({
            success: true,
            folder: folder,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar la carpeta",
        });
      }
    }
  }

  // deletes a folder given an id
  async function deleteFolder() {
    try {
      const folder = await prisma.folder.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        folder: folder,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al eliminar la carpeta",
      });
    }
  }
};

export default protect(handler);
