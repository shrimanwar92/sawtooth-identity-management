"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("sawtooth-sdk/processor/exceptions");
const addressing_1 = require("../services/addressing");
const encoding_1 = require("./../services/encoding");
function createUser(context, publicKey, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const address = addressing_1.default.getUserAddress(publicKey);
        try {
            const state = yield context.getState([address]);
            const updates = {};
            if (state[address].length > 0) {
                throw new exceptions_1.InvalidTransaction(`Collection already exists with key: ${publicKey}`);
            }
            updates[address] = encoding_1.encode({ owner: publicKey, user: payload.data, approvedList: payload.approvedList });
            return context.setState(updates);
        }
        catch (err) {
            throw new Error(err);
        }
    });
}
exports.createUser = createUser;
function updateUser(context, publicKey, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const address = addressing_1.default.getUserAddress(publicKey);
        const updates = {};
        try {
            const state = yield context.getState([address]);
            const decodedUser = encoding_1.decode(state[address]);
            console.log(decodedUser);
            if (state[address].length == 0) {
                throw new exceptions_1.InvalidTransaction(`User does not exist with key: ${publicKey}`);
            }
            if (decodedUser['owner'] != publicKey) {
                throw new exceptions_1.InvalidTransaction(`Update can be done by owner itself.`);
            }
            updates[address] = encoding_1.encode({ owner: publicKey, user: payload.data, approvedList: decodedUser.approvedList });
            return context.setState(updates);
        }
        catch (err) {
            throw new Error(err);
        }
    });
}
exports.updateUser = updateUser;
function deleteUser(context, publicKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const address = addressing_1.default.getUserAddress(publicKey);
        try {
            const state = yield context.getState([address]);
            if (state[address].length == 0) {
                throw new exceptions_1.InvalidTransaction(`User does not exist with key: ${publicKey}`);
            }
            return context.deleteState([address]);
        }
        catch (err) {
            new Error(err);
        }
    });
}
exports.deleteUser = deleteUser;
function approve(context, publicKey) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.approve = approve;
function reject(context, publicKey) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.reject = reject;
