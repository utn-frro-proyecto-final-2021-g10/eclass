import type { NextApiResponse } from "next";
import { reqWithUser } from "../../../../types/reqWithUser";
import { prisma } from "../../../../lib/prisma";
import { protect } from "../../../../middleware/protect";
import { Role } from "@prisma/client";

const me = async (req: reqWithUser, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "method not allowed",
    });
  }
  if (req.user.role === Role.admin) {
    return res.status(401).json({
      success: false,
      message: "Metodo no permitido para admin",
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
      },
    });
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export default protect(me);
