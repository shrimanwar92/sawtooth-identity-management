"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const CONSTANTS = require("./constants");
const PREFIXES = {
    USER: '00'
};
class AddressStore {
    hash(str, length) {
        return crypto_1.createHash('sha512').update(str).digest('hex').slice(0, length);
    }
    getUserAddress(publicKey) {
        return CONSTANTS.NAMESPACE + PREFIXES.USER + this.hash(publicKey, 62);
    }
    isValidAddress(address) {
        const pattern = `^${CONSTANTS.NAMESPACE}[0-9a-f]{64}$`;
        return new RegExp(pattern).test(address);
    }
}
exports.default = new AddressStore();
