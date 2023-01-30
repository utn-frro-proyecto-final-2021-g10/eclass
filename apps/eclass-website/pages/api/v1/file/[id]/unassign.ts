import type { NextApiResponse } from "next";
import { protect } from "../../../../../middleware/protect";
import { reqWithUser } from "../../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  if (req.body) {
    const { course } = req.body;

    try {
      const remove = await prisma.courseFiles.deleteMany({
        where: {
          fileId: req.query.id.toString(),
          courseId: course,
        },
      });

      if (remove) {
        return res.status(200).json({
          success: true,
          message: "Archivo desasignado",
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al desasignar archivo",
      });
    }
  }
};

export default protect(handler);
