import type { NextApiResponse } from "next";
import { reqWithUser } from "../types/reqWithUser";
import { getSession } from "next-auth/react";
import { Role } from "@prisma/client";

export const protect =
  (handler: any) => async (req: reqWithUser, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (session?.user) {
      req.user = session.user;
      return handler(req, res);
    }
    return res.status(401).json({ success: false, message: "Unauthorized" });
  };

  export const protectWithRoles =
  (handler: any, rolesAllowed: Role[]) => async (req: reqWithUser, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (session?.user) {
      req.user = session.user;

      if (rolesAllowed.includes(req.user.role)) return handler(req, res);
      else return res.status(401).json({ success: false, message: "Unauthorized" }); 
    }
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }; 