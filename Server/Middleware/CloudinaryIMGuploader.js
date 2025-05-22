import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  const result = cloudinary.uploader.upload(file, (err, result) => {
    if (err) {
        console.log(err);
      return {
        success: false,
        message: err.message,
      };
    } else {
      return {
        success: true,
        message: "Uploaded!",
        data: result.url,
      };
    }
  });

  return result;
};

export const updateImage = async (file, IMGurl) => {
  try {

    //VERIFIES IF THE URL PATH IS FROM CLOUDINARY
    const isUrl = typeof IMGurl === 'string' && ( IMGurl.startsWith('http') || IMGurl.startsWith("https"));
    const isCloudinaryUrl = isUrl && IMGurl.includes('res.cloudinary.com');

    if(isCloudinaryUrl){
      const public_id = getPublicIdFromIMGURL(IMGurl);
      const deletedResult = await deleteImageFromImageHost(public_id);
      console.log("DELETED DATA RESULT: ", deletedResult);
    }
    ////
    const result = await uploadImage(file);

    return {
      success: true,
      message: "Image Updated!",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const getPublicIdFromIMGURL = (url) => {
  const parts = url.split("/upload/");
  if (parts.length < 2) return parts;
  const pathWithVersion = parts[1].split(".")[0]; 
  const pathSegments = pathWithVersion.split("/");

  if (pathSegments[0].startsWith("v") && !isNaN(pathSegments[0].slice(1))) {
    pathSegments.shift(); 
  }

  return pathSegments.join("/");
};

export const deleteImageFromImageHost = async (fileURL) => {
  const public_id = getPublicIdFromIMGURL(fileURL);
  if (public_id === null) return {success: false, message: "Image Does Not Exists"};
  await cloudinary.uploader.destroy(
    public_id,
    { resource_type: "image" },
    (err, result) => {
      if (err) {
        console.log(err);
        return {
          success: false,
          message: err.message,
        };
      } else {
        console.log(err);
      }
    }
  );
};
