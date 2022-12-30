import { NextApiResponse } from "next";
import { protectWithRoles } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
import { Role } from "@prisma/client";
import { generate } from "../../../../lib/bcrypt";
const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getUsers();
    case "POST":
      return createUser();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
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
        const user = await prisma.user.create({
          data: {
            ...req.body,
            password: await generate(req.body.password),
          },
        });
        return res.status(200).json({
          success: true,
          user: user,
        });
      } catch (error: any) {
        console.log(error);

        return res.status(400).json({
          success: false,
          message:
            env === "development" ? error.message : "Error al crear el usuario",
          env: env,
        });
      }
    }
  }
}

export default protectWithRoles(handler, [Role.admin]);
