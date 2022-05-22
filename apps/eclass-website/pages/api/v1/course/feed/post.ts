import type { NextApiResponse } from "next";
import { reqWithUser } from "../../../../../types/reqWithUser";
import { prisma } from "../../../../../lib/prisma";
import { protect } from "../../../../../middleware/protect";

const add = async (req: reqWithUser, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
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
          message: "Incorrect forum id",
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
        message: "Forum id is required",
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default protect(add);
