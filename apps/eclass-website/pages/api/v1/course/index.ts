import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

const env = process.env.NODE_ENV;

function handler(req: reqWithUser, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getCourses();
    case "POST":
      return createCourse();
    default:
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`,
      });
  }

  // gets all courses
  async function getCourses() {
    const courses = await prisma.course.findMany({});
    if (courses)
      return res.status(200).json({
        success: true,
        courses: courses,
      });
    return res.status(404).json({
      success: false,
      message: "No se encontraron cursos",
    });
  }
  // creates a course
  async function createCourse() {
    if (req.body) {
      try {
        const course = await prisma.course.create({
          data: req.body
        });
        return res.status(200).json({
          success: true,
          course: course,
        });
      } catch (error: any) {
          return res.status(400).json({
            success: false,
            message: env === 'development' ? error.message : "Error al crear el curso"    
        })
      }
    }
  }
}

export default protect(handler)