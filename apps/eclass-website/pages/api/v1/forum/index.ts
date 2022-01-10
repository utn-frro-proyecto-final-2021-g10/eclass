import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getForums();
    case "POST":
      return createForum();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }

  // gets all forums
  async function getForums() {
    const forums = await prisma.forum.findMany();
    if (forums)
      return res.status(200).json({
        success: true,
        forums: forums,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron foros",
    });
  }
  // creates an forum
  async function createForum() {
    if (req.body) {
      try {
        const forum = await prisma.forum.create({
          data: req.body
        });
        return res.status(200).json({
          success: true,
          forum: forum,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: env === 'development' ? error.message :  "Error al crear el foro",
        });
      }
    }
  }
}

export default protect(handler);
