"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsoa_1 = require("tsoa");
const repository_1 = require("./repository");
let UserController = class UserController {
    /**
     * The `getUsers` function takes in a `name`, `email`, `page` and `size` query parameter and returns a `UsersResponse`
    * @param {string} [name] - string
    * @param {string} [email] - string
    * @param [page=1] - The page number of the results to return.
    * @param [size=10] - The number of items to return per page.
    * @returns The return type is UsersResponse.
    */
    getUsers(name, email, page = 1, size = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, repository_1.getUsers)(name, email, page, size);
        });
    }
    /**
    * The `getUser` function takes in a `name` and `email` query parameter and returns a `UserResponse`
    * object
    * @param {string} [name] - string - This is the name of the user.
    * @param {string} [email] - The email of the user to get.
    * @returns A promise of a UserResponse object
    */
    getUser(name, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, repository_1.getUser)(name, email);
        });
    }
    /**
     * The `getUserId` function takes in a `id` path parameter and returns a promise of a User object
     * @param {string} id - string - This is the path parameter. It's the id of the user we want to get.
     * @returns The user object
     */
    getUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, repository_1.getUserById)(id);
        });
    }
    /**
     * The `createUser` function takes in a `User` object and returns a promise of a User object
     * @param {User} requestBody - User
     * @returns A promise of a user object
     */
    createUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, repository_1.createUser)(requestBody);
        });
    }
    /**
     * The `updateUser` function takes in a `id` path parameter and a `User` object and returns a promise of a User object
     * @param {string} id - string - This is the id of the user we want to update.
     * @param {User} requestBody - This is the body of the request. It's the data that the user is
     * sending to the server.
     * @returns The updated user
     */
    updateUser(id, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, repository_1.updateUser)(id, requestBody);
        });
    }
    /**
     * The `deleteUser` function takes in a `id` path parameter and returns a promise of a User object
     * @param {string} id - string - This is the path parameter. It's the id of the user we want to
     * delete.
     * @returns The user that was deleted
     */
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, repository_1.deleteUser)(id);
        });
    }
};
__decorate([
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    (0, tsoa_1.Response)(403, 'Forbidden'),
    (0, tsoa_1.Get)('/'),
    (0, tsoa_1.OperationId)('getUsers'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    (0, tsoa_1.Response)(403, 'Forbidden'),
    (0, tsoa_1.Get)('/user'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    (0, tsoa_1.Response)(403, 'Forbidden'),
    (0, tsoa_1.Get)('/{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserId", null);
__decorate([
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    (0, tsoa_1.Response)(400, 'Validation Failed'),
    (0, tsoa_1.SuccessResponse)('201', 'Created'),
    (0, tsoa_1.Post)('/'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, tsoa_1.Put)('/{id}'),
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    (0, tsoa_1.Response)(400, 'Validation Failed'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, tsoa_1.Delete)('/{id}'),
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
UserController = __decorate([
    (0, tsoa_1.Tags)('User'),
    (0, tsoa_1.Route)('users')
], UserController);
exports.default = UserController;
