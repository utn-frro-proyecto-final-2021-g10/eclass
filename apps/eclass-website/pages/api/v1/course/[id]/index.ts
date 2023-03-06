import { NextApiResponse } from "next";
import { protect } from "../../../../../middleware/protect";
import { reqWithUser } from "../../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getCourse();
    case "PUT":
      return updateCourse();
    case "DELETE":
      return deleteCourse();
    default:
      return res.status(405).json({
        success: false,
        message: "Método no permitido",
      });
  }

  async function updateCourse() {
    try {
      const { settings, ...courseData } = req.body;

      const course = await prisma.course.update({
        where: {
          id: req.query.id.toString(),
        },

        data: {
          ...courseData,
          settings: {
            update: {
              ...settings,
            },
          },
        },
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
  async function deleteCourse() {
    try {
      const course = await prisma.course.delete({
        where: {
          id: req.query.id.toString(),
        },
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
        message: "Error al eliminar curso",
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
        files: {
          include: {
            file: {
              include: {
                folder: {
                  include: {
                    professor: true,
                  },
                },
              },
            },
          },
        },
        tasks: {
          ...(req.user.role === "student"
            ? {
                where: {
                  dateEnd: {
                    gt: new Date(),
                  },
                  OR: [
                    {
                      dateStart: {
                        lt: new Date(),
                      },
                    },
                    {
                      dateStart: null,
                    },
                  ],
                  published: {
                    equals: true,
                  },
                },
              }
            : {}),
        },
        settings: true,
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
        message: "Curso no encontrado",
      });
    }
  }
};

export default protect(handler);
