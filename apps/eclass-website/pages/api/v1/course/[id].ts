import { Role } from "@prisma/client";
import type { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
const env = process.env.NODE_ENV;

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getCourseById();
    case "PUT":
      return updateCourse();
    case "DELETE":
      return deleteCourse();
    default:
      return res.status(405).json({
        success: false,
        message: `Metodo ${req.method} no permitido`,
      });
  }
  // Finds a course given a course id
  async function getCourseById() {
    if (req.user.role !== Role.admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const course = await prisma.course.findUnique({
      where: {
        id: req.query.id.toString(),
      },
    });

    if (course) {
      return res.status(200).json({
        success: true,
        course: course,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Curso no encontrado",
    });
  }
  /// updates a course given a course in the body of the request
  async function updateCourse() {
    if (req.user.role !== Role.admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    if (req.body) {
      try {
        const course = await prisma.course.update({
          where: {
            id: req.query.id.toString(),
          },
          data: req.body,
        });
        if (course) {
          return res.status(200).json({
            success: true,
            course: course,
          });
        }
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message:
            env === "development" ? error.message : "Error al modificar curso",
        });
      }
    }
  }

  // deletes a course given an id
  async function deleteCourse() {
    if (req.user.role !== Role.admin) {
      return res.status(401).json({
        success: false,
        messsage: "Unauthorized",
      });
    }
    try {
      const course = await prisma.course.delete({
        where: {
          id: req.query.id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        course: course,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message:
          env === "development" ? error.message : "Error al eliminar curso",
      });
    }
  }
};

export default protect(handler);
