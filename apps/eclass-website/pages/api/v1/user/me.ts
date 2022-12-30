import type { NextApiResponse } from "next";
import { reqWithUser } from "../../../../types/reqWithUser";
import { prisma } from "../../../../lib/prisma";
import { protect } from "../../../../middleware/protect";

const me = async (req: reqWithUser, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Método no permitido",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        courses: {
          include: {
            course: {
              include: {
                owner: true,
                settings: true,
              },
            },
          },
        },
        ownedCourses: {
          include: {
            settings: true,
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Algo ha salido mal",
    });
  }
};

export default protect(me);
