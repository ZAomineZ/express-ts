"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const path_1 = __importDefault(require("path"));
class File {
    /**
     * @return String
     */
    static getPathBaseName() {
        return path_1.default.join(__dirname, '../../', 'assets');
    }
}
exports.File = File;