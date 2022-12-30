import type { NextApiResponse } from "next";
import { reqWithUser } from "../../../../../types/reqWithUser";
import { prisma } from "../../../../../lib/prisma";
import { protect } from "../../../../../middleware/protect";

const add = async (req: reqWithUser, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Método no permitido",
    });
  }

  try {
    if (req.body?.forumId) {
      const forum = await prisma.forum.findUnique({
        where: {
          id: req.body.forumId,
        },
      });

      if (!forum) {
        return res.status(404).json({
          success: false,
          message: "Id de foro incorrecto",
        });
      }

      const message = await prisma.message.create({
        data: {
          forum: {
            connect: {
              id: forum.id,
            },
          },
          user: {
            connect: {
              id: req.user.id,
            },
          },
          description: req.body.description,
          datetime: new Date(),
          replies: undefined,
        },
      });

      return res.status(200).json({
        success: true,
        message,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "El id de foro es requerido",
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Algo ha salido mal",
    });
  }
};

export default protect(add);
