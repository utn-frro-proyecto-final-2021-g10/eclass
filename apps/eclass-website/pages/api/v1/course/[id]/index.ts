import { NextApiResponse } from "next";
import { protect } from "../../../../../middleware/protect";
import { reqWithUser } from "../../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getCourse();
    case "PUT":
      return updateCourse();
    default:
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
  }

  async function updateCourse() {
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
          field: course,
        });
      }
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
        message: "Error al modificar campo",
      });
    }
  }

  async function getCourse() {
    const course = await prisma.course.findUnique({
      where: {
        slug: req.query.id.toString(),
      },
      include: {
        forum: {
          include: {
            messages: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    profileImageUrl: true,
                  },
                },
                replies: {
                  include: {
                    user: {
                      select: {
                        firstName: true,
                        lastName: true,
                        profileImageUrl: true,
                      },
                    },
                  },
                  orderBy: {
                    datetime: "desc",
                  },
                },
              },
              orderBy: {
                datetime: "desc",
              },
            },
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                profileImageUrl: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (course) {
      return res.status(200).json({
        success: true,
        course,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
  }
};

export default protect(handler);
