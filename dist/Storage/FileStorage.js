"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
class FileStorage {
    /**
     * @param {String} directory
     */
    static upload(directory) {
        let storage = multer_1.default.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './assets/img/' + directory);
            },
            filename(req, file, callback) {
                callback(null, file.originalname);
            }
        });
        let fileFilter = function (req, file, cb) {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        };
        return multer_1.default({ storage, fileFilter });
    }
}
exports.FileStorage = FileStorage;
