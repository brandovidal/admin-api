"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const controller_1 = __importDefault(require("./controller"));
const controller = new controller_1.default();
const getUsers = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    const { count, total, users } = yield controller.getUsers();
    console.log('🚀 ~ file: function.ts:11 ~ getUsers ~ users', users);
    return {
        statusCode: 200,
        body: JSON.stringify({
            count,
            total,
            users
        })
    };
});
exports.getUsers = getUsers;