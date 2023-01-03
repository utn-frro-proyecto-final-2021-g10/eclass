import type { NextApiResponse } from "next";
import { protect } from "../../../../../middleware/protect";
import { reqWithUser } from "../../../../../types/reqWithUser";

const handler = async (req: reqWithUser, res: NextApiResponse) => {
  if (req.body) {
    const { courses } = req.body;

    try {
      await prisma.courseFiles.deleteMany({
        where: {
          fileId: req.query.id.toString(),
        },
      });

      const create = await prisma.courseFiles.createMany({
        data: courses.map((course: string) => {
          return {
            courseId: course,
            fileId: req.query.id.toString(),
          };
        }),
      });

      if (create) {
        return res.status(200).json({
          success: true,
          message: "Archivo asignado",
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al asignar archivo",
      });
    }
  }
};

export default protect(handler);
