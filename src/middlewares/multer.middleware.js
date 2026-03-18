
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, File, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, File, cb) {
      const name = Date.now() + "_" + File.originalname.replace(/\s+/g, "_");
      cb(null, name)
    }
  })
  
export const upload = multer({ 
    storage, 
})
