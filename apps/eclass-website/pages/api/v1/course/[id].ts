import type { NextApiRequest, NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
    if (req.body) {
      try {
        const course = await prisma.course.update({
          where: {
            id: req.query.id.toString(),
          },
          data: {
            description: req.body.course.description,
            enrollmentId: req.body.course.enrollmentId,
            imageUrl: req.body.course.imageUrl,
            members: req.body.course.members,
            moreInfo: req.body.course.moreInfo,
            name: req.body.course.name,
            owner: req.body.course.owner,
            ownerId: req.body.course.ownerId,
            settings: req.body.course.settings,
            slug: req.body.course.slug,
          },
        });
        if (course) {
          return res.status(200).json({
            success: true,
            course: course,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error al modificar curso",
        });
      }
    }
  }

  // deletes a course given an id
  async function deleteCourse() {
    try{

      const course = await prisma.course.delete({
        where: {
          id: req.query.id.toString()
        }
      });
      return res.status(200).json({
        success: true,
        course: course
      })
    }
    catch(error){
      return res.status(400).json({
        success: false,
        message: "Error al eliminar curso"
      })
    }
    
  }
};

export default protect(handler);
