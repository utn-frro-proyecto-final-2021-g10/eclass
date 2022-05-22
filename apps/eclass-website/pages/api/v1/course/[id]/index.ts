import { NextApiResponse } from "next";
import { protect } from "../../../../../middleware/protect";
import { reqWithUser } from "../../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

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
};

export default protect(handler);
