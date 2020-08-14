import multer from 'multer'

export class FileStorage {

    /**
     * @param {String} directory
     */
    static upload(directory: String) {
        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './assets/img/' + directory)
            },
            filename(req, file, callback): void {
                callback(null, file.originalname)
            }
        });

        let fileFilter = function (req: any, file: any, cb: any) {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
                cb(null, true)
            } else {
                cb(null, false)
            }
        }

        return multer({storage, fileFilter});
    }
}