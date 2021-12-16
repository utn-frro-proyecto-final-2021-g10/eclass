import type { NextApiResponse } from "next";
import { reqWithUser } from "../types/reqWithUser";
import { getSession } from "next-auth/react";

// TODO: add the ability to protect by role
export const protect =
  (handler: any) => async (req: reqWithUser, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (session?.user) {
      req.user = session.user;
      return handler(req, res);
    }
    return res.status(401).json({ success: false, message: "Unauthorized" });
  };
