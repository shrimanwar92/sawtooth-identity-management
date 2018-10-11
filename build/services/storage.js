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
const crypto_1 = require("crypto");
const signing_1 = require("sawtooth-sdk/signing");
const fs = require("fs");
const path = require("path");
const secp256k1_1 = require("sawtooth-sdk/signing/secp256k1");
const addressing_1 = require("./addressing");
class Storage {
    makeKeyPair(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = signing_1.createContext('secp256k1');
            const privateKey = context.newRandomPrivateKey();
            const signer = new signing_1.CryptoFactory(context).newSigner(privateKey);
            const privateKeyHex = privateKey.asHex();
            const publicKeyHex = signer.getPublicKey().asHex();
            try {
                fs.writeFileSync(path.resolve(__dirname, `./../keys/${userName}.priv`), privateKeyHex);
                fs.writeFileSync(path.resolve(__dirname, `./../keys/${userName}.pub`), publicKeyHex);
                return true;
            }
            catch (err) {
                return err;
            }
        });
    }
    getUserPublicKey(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield fs.readFileSync(`${process.cwd()}/keys/${userName}.pub`);
            }
            catch (err) {
                return err;
            }
        });
    }
    getUserPrivateKey(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield fs.readFileSync(`${process.cwd()}/keys/${userName}.priv`);
            }
            catch (err) {
                return err;
            }
        });
    }
    generateAddress(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyPair = yield this.makeKeyPair(userName);
            if (keyPair) {
                try {
                    const address = yield this.getUserAddress(userName);
                    return address;
                }
                catch (err) {
                    console.log(err);
                    return err;
                }
            }
        });
    }
    // Creates user address by reading public key file.
    getUserAddress(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const privKey = yield this.getUserPrivateKey(userName);
                const privateKeyStr = privKey.toString().trim();
                const context = signing_1.createContext('secp256k1');
                const privateKey = secp256k1_1.Secp256k1PrivateKey.fromHex(privateKeyStr);
                const signer = new signing_1.CryptoFactory(context).newSigner(privateKey);
                const publicKey = signer.getPublicKey().asHex();
                const address = addressing_1.default.getUserAddress(publicKey);
                return {
                    address: address,
                    publicKey: publicKey,
                    signer: signer,
                    privateKey: privateKeyStr
                };
            }
            catch (err) {
                return err;
            }
        });
    }
    hash(v) {
        return crypto_1.createHash('sha512').update(v).digest('hex');
    }
}
exports.default = Storage;
