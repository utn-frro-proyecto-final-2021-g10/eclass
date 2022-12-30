import { NextApiResponse } from "next";
import { protect } from "../../../../middleware/protect";
import { reqWithUser } from "../../../../types/reqWithUser";
import { formidable } from "formidable";
import { v2 as cloudinary } from "cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: reqWithUser, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(401).json({
      message: "Método no permitido",
    });
  }

  const data = await new Promise(function (resolve, reject) {
    const form = new formidable.IncomingForm({ keepExtensions: true });
    form.parse(req, function (err, fields, files) {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  if (data.fields.id !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: "El usuario no coincide con el usuario que se intenta modificar",
    });
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const response = await cloudinary.uploader.upload(data.files.image.filepath, {
    folder: "eclass/profile-images",
    use_filename: true,
    unique_filename: false,
  });

  try {
    const user = await prisma.user.update({
      where: {
        id: data.fields.id.toString(),
      },
      data: {
        profileImageUrl: response.secure_url,
      },
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

export default protect(handler);
