import { NextApiRequest, NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";

function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getUsers();
    case "POST":
      return createUser();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }

  // gets all Users
  async function getUsers() {
    const users = await prisma.user.findMany();
    if (users)
      return res.status(200).json({
        success: true,
        users: users,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron usuarios",
    });
  }
  // creates a user
  async function createUser() {
    if (req.body) {
      try {
        const user = prisma.user.create(req.body);
        return res.status(200).json({
          success: true,
          user: user,
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al crear el curso",
        });
      }
    }
  }
}

export default protect(handler);
