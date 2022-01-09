import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
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
        message: `Metodo ${req.method} no permitido`,
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
  /// updates a user given a user in the body of the request
  async function updateUser() {
    if (req.body) {
      try {
        const user = await prisma.user.update({
          where: {
            id: req.query.id.toString(),
          },
          data: {
            email: req.body.user.email,
            password: req.body.user.password,
            answers: req.body.user.answers,
            files : req.body.user.files,
            birthDate: req.body.user.birthDate,
            firstName: req.body.user.firstName,
            lastName: req.body.user.lastName,
            courses: req.body.user.courses,
            messages: req.body.user.messages,
            ownedCourses: req.body.user.ownedCourses,
            profileImageUrl: req.body.user.profileImageUrl,
            role: req.body.user.role,
          },
            
        });
        if (user) {
          return res.status(200).json({
            success: true,
            user: user,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar usuario",
        });
      }
    }
  }

  // deletes a user given an id
  async function deleteUser() {
    try{

      const user = await prisma.user.delete({
        where: {
          id: req.query.id.toString()
        }
      });
      return res.status(200).json({
        success: true,
        user: user
      })
    }
    catch(error){
      return res.status(400).json({
        success: false,
        message: "Error al eliminar usuario"
      })
    }
    
  }
};

export default protect(handler);
