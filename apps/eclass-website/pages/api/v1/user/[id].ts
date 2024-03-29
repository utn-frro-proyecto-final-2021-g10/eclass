import { Role } from "@prisma/client";
import type { NextApiResponse } from "next";
import { generate } from "../../../../lib/bcrypt";
import { protectWithRoles } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getUserById();
    case "PUT":
      return updateUser();
    case "DELETE":
      return deleteUser();
    default:
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} no permitido`,
      });
  }
  // Finds a user given a course id
  async function getUserById() {
    const user = await prisma.user.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (user) {
      return res.status(200).json({
        success: true,
        user: user,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  // updates a user given a user in the body of the request
  async function updateUser() {
    if (req.body) {
      try {
        const user = await prisma.user.update({
          where: {
            id: req.query.id.toString(),
          },
          data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            role: req.body.role,
            institutionIdentifier: req.body.institutionIdentifier,
            birthDate: req.body.birthDate,
            profileImageUrl: req.body.profileImageUrl,
            ...(req.body.password &&
              req.body.password !== "" && {
                password: await generate(req.body.password),
              }),
          },
        });
        if (user) {
          return res.status(200).json({
            success: true,
            user: user,
          });
        }
      } catch (error) {
        console.log(error);

        return res.status(400).json({
          success: false,
          message: "Error al modificar usuario",
        });
      }
    }
  }

  // deletes a user given an id
  async function deleteUser() {
    try {
      const user = await prisma.user.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        user: user,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
        message: "Error al eliminar usuario",
      });
    }
  }
};

export default protectWithRoles(handler, [Role.admin]);
