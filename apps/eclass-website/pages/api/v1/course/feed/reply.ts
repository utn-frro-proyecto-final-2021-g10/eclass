import type { NextApiResponse } from "next";
import { reqWithUser } from "../../../../../types/reqWithUser";
import { prisma } from "../../../../../lib/prisma";
import { protect } from "../../../../../middleware/protect";

const reply = async (req: reqWithUser, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    if (req.body?.messageId) {
      const message = await prisma.message.findUnique({
        where: {
          id: req.body.messageId,
        },
      });

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Incorrect message id",
        });
      }

      const reply = await prisma.reply.create({
        data: {
          message: {
            connect: {
              id: message.id,
            },
          },
          user: {
            connect: {
              id: req.user.id,
            },
          },
          description: req.body.description,
          datetime: new Date(),
        },
      });

      return res.status(200).json({
        success: true,
        reply,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Message id is required",
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default protect(reply);
