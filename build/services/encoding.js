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
const eth_crypto_1 = require("eth-crypto");
const ALGORITHM = 'aes-256-ctr';
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
            const encrypted = yield eth_crypto_1.default.encryptWithPublicKey(publicKeyHex, JSON.stringify(payload));
            return eth_crypto_1.default.cipher.stringify(encrypted);
        });
    }
    static decrypt(privateKeyHex, encryptedString) {
        return __awaiter(this, void 0, void 0, function* () {
            const encryptedObject = eth_crypto_1.default.cipher.parse(encryptedString);
            const decrypted = yield eth_crypto_1.default.decryptWithPrivateKey(privateKeyHex, encryptedObject);
            return JSON.parse(decrypted);
            /*return await EthCrypto.decryptWithPrivateKey( privateKeyHex, {
                iv: encryptedData.iv,
                ephemPublicKey: encryptedData.ephemPublicKey,
                ciphertext: encryptedData.ciphertext,
                mac: encryptedData.mac
            });*/
        });
    }
}
exports.AsymmetricEncryption = AsymmetricEncryption;
const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()));
exports.encode = encode;
const decode = base64Str => JSON.parse(Buffer.from(base64Str, 'base64').toString());
exports.decode = decode;
