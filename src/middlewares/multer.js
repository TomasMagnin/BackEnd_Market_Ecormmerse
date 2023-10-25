import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadFolder = '';

        if (file.fieldname === 'profileImage') {
            uploadFolder = path.join(__dirname, '../public/uploads/profile');
        } else if (file.fieldname === 'productImage') {
            uploadFolder = path.join(__dirname, '../public/uploads/product');
        } else {
            uploadFolder = path.join(__dirname, '../public/uploads/documents');
        }

        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        const splitted = file.originalname.split('.')
        const extension = splitted[splitted.length - 1];
        const user = req.user
        cb(null, `${String(user._id)}-${file.fieldname}.${extension}`);
    }
});

const upload = multer({ storage: storage });

export default upload ;