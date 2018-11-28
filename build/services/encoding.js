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
const crypto = require("crypto");
const ecies = require("standard-ecies");
const ALGORITHM = 'aes-256-ctr';
const options = {
    hashName: 'sha256',
    hashLength: 32,
    macName: 'sha256',
    macLength: 32,
    curveName: 'secp256k1',
    symmetricCypherName: 'aes-256-ecb',
    iv: null,
    keyFormat: 'uncompressed',
    s1: null,
    s2: null // optional shared information2
};
class SymmetricEncryption {
    static generateDocumentPwd(pubKey) {
        return crypto.createHash('sha256').update(pubKey).digest('base64');
    }
    static encryptDocument(data, pwd) {
        return crypto.createCipher(ALGORITHM, pwd).update(JSON.stringify(data), "utf8", "hex");
    }
    static decryptDocument(data, pwd) {
        return crypto.createDecipher(ALGORITHM, pwd).update(data, "hex", "utf8");
    }
}
exports.SymmetricEncryption = SymmetricEncryption;
class AsymmetricEncryption {
    static encrypt(publicKeyHex, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const bufferedPayload = Buffer.from(payload.toString());
            return ecies.encrypt(Buffer.from(publicKeyHex, 'hex'), bufferedPayload, options);
        });
    }
    static decrypt(privateKeyHex, encryptedText) {
        return __awaiter(this, void 0, void 0, function* () {
            const ecdh = crypto.createECDH(options.curveName);
            ecdh.setPrivateKey(privateKeyHex, 'hex');
            return ecies.decrypt(ecdh, encryptedText, options);
        });
    }
}
exports.AsymmetricEncryption = AsymmetricEncryption;
const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()));
exports.encode = encode;
const decode = base64Str => JSON.parse(Buffer.from(base64Str, 'base64').toString());
exports.decode = decode;
