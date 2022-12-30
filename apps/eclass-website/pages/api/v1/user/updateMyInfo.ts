import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";

async function handler(req: reqWithUser, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(401).json({
      message: "Método no permitido",
    });
  }

  if (req.body.id !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: "El usuario no coincide con el usuario que se intenta modificar",
    });
  }

  if (req.body) {
    try {
      const user = await prisma.user.update({
        where: {
          id: req.body.id.toString(),
        },
        data: req.body,
      });
      if (user) {
        return res.status(200).json({
          success: true,
          user: user,
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error al modificar el usuario",
      });
    }
  }
}

export default protect(handler);
