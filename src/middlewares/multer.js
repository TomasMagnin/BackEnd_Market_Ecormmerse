import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadFolder = '';

        if (file.fieldname === 'profileImage') {
            uploadFolder = path.join(__dirname, '../uploads/profile');
        } else if (file.fieldname === 'productImage') {
            uploadFolder = path.join(__dirname, '../uploads/product');
        } else {
            uploadFolder = 'uploads/documents/';
        }

        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

export default upload;