import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getFiles();
    case "POST":
      return createFile();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }

  // gets all files
  async function getFiles() {
    const files = await prisma.file.findMany();
    if (files)
      return res.status(200).json({
        success: true,
        files: files,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron archivos",
    });
  }
  
  // creates an file
  async function createFile() {
    if (req.body) {
      try {
        const file = await prisma.file.create({
          data: req.body,
        });
        return res.status(200).json({
          success: true,
          file: file,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message:
            env === "development" ? error.message : "Error al crear el archivo",
        });
      }
    }
  }
}

export default protect(handler);
