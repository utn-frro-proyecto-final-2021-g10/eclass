import type { NextApiRequest } from "next";

export interface reqWithUser extends NextApiRequest {
  user: any;
}
