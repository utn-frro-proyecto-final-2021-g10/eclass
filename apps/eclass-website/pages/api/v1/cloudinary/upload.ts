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
      message: "Metodo no permitido",
    });
  }

  const data = await new Promise(function (resolve, reject) {
    const form = new formidable.IncomingForm({ keepExtensions: true });
    form.parse(req, function (err, fields, files) {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const response = await cloudinary.uploader.upload(data.files.image.filepath, {
    folder: `eclass/${req.query.folder}`,
    use_filename: true,
    unique_filename: false,
  });

  if (response) {
    return res.status(200).json({
      success: true,
      filepath: response.secure_url,
    });
  }

  return res.status(400).json({
    success: false,
    message: "Error al subir la imagen",
  });
}

export default protect(handler);
