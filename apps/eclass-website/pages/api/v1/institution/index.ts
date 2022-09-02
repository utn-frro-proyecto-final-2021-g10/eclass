import type { NextApiResponse } from "next";
import { reqWithUser } from "../../../../types/reqWithUser";
import { prisma } from "../../../../lib/prisma";

const institution = async (req: reqWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getInstitution();
    case "PUT":
      return upsertInstitution();

    default:
      return res.status(405).json({
        success: false,
        message: "method not allowed",
      });
  }

  async function upsertInstitution() {
    try {
      const institution = await prisma.institution.upsert({
        where: {
          id: "institution",
        },
        create: req.body,
        update: req.body,
      });
      return res.status(200).json({
        institution,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  }

  async function getInstitution() {
    try {
      const institution = await prisma.institution.findUnique({
        where: {
          id: "institution",
        },
      });
      return res.status(200).json({
        institution,
      });
    } catch (e) {
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  }
};

export default institution;
