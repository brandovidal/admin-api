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
exports.deleteUser = exports.updateUser = exports.createUser = exports.signTokens = exports.findUniqueUser = exports.getUser = exports.getUserById = exports.getUsers = exports.excludedFields = void 0;
const client_1 = require("@prisma/client");
const node_ts_cache_1 = require("node-ts-cache");
const node_ts_cache_storage_memory_1 = require("node-ts-cache-storage-memory");
const repository_1 = require("../../constants/repository");
const just_is_empty_1 = __importDefault(require("just-is-empty"));
const just_omit_1 = __importDefault(require("just-omit"));
const jwt_1 = require("../../utils/jwt");
exports.excludedFields = ['password', 'verified', 'verificationCode'];
const userCache = new node_ts_cache_1.CacheContainer(new node_ts_cache_storage_memory_1.MemoryStorage());
const prisma = new client_1.PrismaClient();
const getUsers = (name, email, page = repository_1.PAGE_DEFAULT, size = repository_1.SIZE_DEFAULT) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const take = size !== null && size !== void 0 ? size : repository_1.SIZE_DEFAULT;
    const skip = (page - 1) * take;
    const cachedUsers = (_a = yield userCache.getItem('get-users')) !== null && _a !== void 0 ? _a : [];
    const cachedTotalUsers = (_b = yield userCache.getItem('total-users')) !== null && _b !== void 0 ? _b : 0;
    // params
    const cachedName = yield userCache.getItem('get-name-users');
    const cachedEmail = yield userCache.getItem('get-email-users');
    const cachedSize = yield userCache.getItem('get-size-users');
    const cachedPage = yield userCache.getItem('get-page-users');
    if (!(0, just_is_empty_1.default)(cachedUsers) && cachedName === name && cachedEmail === email && cachedSize === size && cachedPage === page) {
        return { count: cachedUsers.length, total: cachedTotalUsers, users: cachedUsers };
    }
    const [total, users] = yield prisma.$transaction([
        prisma.user.count(),
        prisma.user.findMany({
            where: {
                name: { contains: name === null || name === void 0 ? void 0 : name.toString(), mode: 'insensitive' },
                email: { contains: email === null || email === void 0 ? void 0 : email.toString(), mode: 'insensitive' }
            },
            take,
            skip,
            orderBy: {
                updatedAt: 'asc'
            }
        })
    ]);
    const count = users.length;
    yield userCache.setItem('get-users', users, { ttl: repository_1.TTL_DEFAULT });
    yield userCache.setItem('total-users', total, { ttl: repository_1.TTL_DEFAULT });
    // params
    yield userCache.setItem('get-name-users', name, { ttl: repository_1.TTL_DEFAULT });
    yield userCache.setItem('get-email-users', email, { ttl: repository_1.TTL_DEFAULT });
    yield userCache.setItem('get-size-users', size, { ttl: repository_1.TTL_DEFAULT });
    yield userCache.setItem('get-page-users', page, { ttl: repository_1.TTL_DEFAULT });
    void prisma.$disconnect();
    return { count, total, users };
});
exports.getUsers = getUsers;
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const cachedUserById = (_c = yield userCache.getItem('get-user-by-id')) !== null && _c !== void 0 ? _c : null;
    const cachedUserId = yield userCache.getItem('get-id-user');
    if (!(0, just_is_empty_1.default)(cachedUserById) && cachedUserId === userId) {
        return cachedUserById;
    }
    const user = yield prisma.user.findFirst({
        where: {
            id: userId
        }
    });
    yield userCache.setItem('get-user-by-id', user, { ttl: repository_1.TTL_DEFAULT });
    // params
    yield userCache.setItem('get-id-user', userId, { ttl: repository_1.TTL_DEFAULT });
    void prisma.$disconnect();
    return user;
});
exports.getUserById = getUserById;
const getUser = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const cachedUser = (_d = yield userCache.getItem('get-only-user')) !== null && _d !== void 0 ? _d : null;
    // params
    const cachedName = yield userCache.getItem('get-only-name');
    const cachedEmail = yield userCache.getItem('get-only-email');
    if (!(0, just_is_empty_1.default)(cachedUser) && cachedName === name && cachedEmail === email) {
        return { user: cachedUser };
    }
    const user = yield prisma.user.findFirst({
        where: {
            name: { contains: name, mode: 'insensitive' },
            email: { contains: email, mode: 'insensitive' }
        }
    });
    yield userCache.setItem('get-only-user', user, { ttl: repository_1.TTL_DEFAULT });
    // params
    yield userCache.setItem('get-only-name', name, { ttl: repository_1.TTL_DEFAULT });
    yield userCache.setItem('get-only-email', email, { ttl: repository_1.TTL_DEFAULT });
    void prisma.$disconnect();
    return { user };
});
exports.getUser = getUser;
const findUniqueUser = (where, select) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield prisma.user.findUnique({
        where,
        select
    }));
    void prisma.$disconnect();
    return user;
});
exports.findUniqueUser = findUniqueUser;
const signTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Create Session
    const userId = user.id;
    yield userCache.setItem(`${userId}`, JSON.stringify((0, just_omit_1.default)(user, ['password', 'verified', 'verificationCode'])), { ttl: repository_1.redisCacheExpiresIn * 60 });
    // redisClient.set(`${user.id}`, JSON.stringify(omit(user, excludedFields)), {
    //   EX: config.get<number>('redisCacheExpiresIn') * 60
    // })
    // 2. Create Access and Refresh tokens
    const accessToken = (0, jwt_1.signJwt)({ sub: user.id }, 'JWT_ACCESS_TOKEN_PRIVATE_KEY', {
        expiresIn: `${repository_1.accessTokenExpiresIn}m`
    });
    const refreshToken = (0, jwt_1.signJwt)({ sub: user.id }, 'JWT_REFRESH_TOKEN_PRIVATE_KEY', {
        expiresIn: `${repository_1.refreshTokenExpiresIn}m`
    });
    return { accessToken, refreshToken };
});
exports.signTokens = signTokens;
const createUser = (userInput) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.create({ data: userInput });
    void prisma.$disconnect();
    return user;
});
exports.createUser = createUser;
const updateUser = (userId, userInput) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.update({
        where: {
            id: userId
        },
        data: userInput
    });
    void prisma.$disconnect();
    return user;
});
exports.updateUser = updateUser;
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.delete({
        where: {
            id: userId
        }
    });
    void prisma.$disconnect();
    return user;
});
exports.deleteUser = deleteUser;
