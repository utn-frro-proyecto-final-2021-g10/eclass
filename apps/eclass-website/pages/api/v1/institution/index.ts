import type { NextApiResponse } from "next";
import { reqWithUser } from "../../../../types/reqWithUser";
import { prisma } from "../../../../lib/prisma";

const institution = async (req: reqWithUser, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "method not allowed",
    });
  }
  try {
    const institution = await prisma.institution.findUnique({
      where: {
        id: "institution",
      },
    });
    return res.status(200).json({
      success: true,
      institution,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export default institution;
