"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import config from 'config'
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ? Sign Access or Refresh Token
const signJwt = (payload, keyName, options) => {
    var _a;
    // const keyValue = config.get<string>(keyName)
    const keyValue = (_a = process.env[keyName]) !== null && _a !== void 0 ? _a : 'private_key';
    const privateKey = Buffer.from(keyValue, 'base64').toString('ascii');
    return jsonwebtoken_1.default.sign(payload, privateKey, Object.assign(Object.assign({}, options), { algorithm: 'HS256' }));
};
exports.signJwt = signJwt;
// ? Verify Access or Refresh Token
// ? Verify Access or Refresh Token
const verifyJwt = (token, keyName) => {
    var _a;
    try {
        const keyValue = (_a = process.env[keyName]) !== null && _a !== void 0 ? _a : 'private_key';
        const publicKey = Buffer.from(keyValue, 'base64').toString('ascii');
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyJwt = verifyJwt;
