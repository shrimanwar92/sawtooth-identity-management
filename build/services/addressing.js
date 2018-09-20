"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const NAMESPACE = '70d6c6';
const PREFIXES = {
    USER: '00'
};
class AddressStore {
    hash(str, length) {
        return crypto_1.createHash('sha512').update(str).digest('hex').slice(0, length);
    }
    getUserAddress(publicKey) {
        return NAMESPACE + PREFIXES.USER + this.hash(publicKey, 62);
    }
    isValidAddress(address) {
        const pattern = `^${NAMESPACE}[0-9a-f]{64}$`;
        return new RegExp(pattern).test(address);
    }
}
exports.default = new AddressStore();
