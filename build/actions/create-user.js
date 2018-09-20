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
const encoding_1 = require("../services/encoding");
const buildUser = (user, publicKey) => {
    return {
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        aadhar: user.aadhar,
        pan: user.pan,
        documents: [],
        approvedList: [],
        owner: publicKey
    };
};
function createUser(context, publicKey, signature, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        const address = addressing_1.default.getUserAddress(publicKey);
        try {
            const state = yield context.getState([address]);
            const updates = {};
            if (state[address].length > 0) {
                throw new exceptions_1.InvalidTransaction(`Collection already exists with key: ${publicKey}`);
            }
            const user = buildUser(userData, publicKey);
            updates[address] = encoding_1.encode({
                key: publicKey,
                user: user
            });
            return context.setState(updates);
        }
        catch (err) {
            throw new Error(err);
        }
    });
}
exports.default = createUser;
