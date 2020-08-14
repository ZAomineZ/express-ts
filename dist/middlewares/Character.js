"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
const db_1 = __importDefault(require("../db"));
class Character {
    constructor() {
        this.db = new db_1.default();
    }
}
exports.Character = Character;
