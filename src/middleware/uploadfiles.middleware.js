import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";
    if (req.files) {
      if (
        Array.isArray(req.files.profile) &&
        req.files.profile[0]?.fieldname === "profile"
      ) {
        uploadPath = "public/profiles/";
      } else if (
        Array.isArray(req.files.product) &&
        req.files.product[0]?.fieldname === "product"
      ) {
        uploadPath = "public/products/";
      } else if (
        Array.isArray(req.files.document) &&
        req.files.document[0]?.fieldname === "document"
      ) {
        uploadPath = "public/documents/";
      }
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, (req.user?.email || "unknown") + "-" + file.originalname);
  },
});

export const uploadFilesMiddleware = multer({ storage });
