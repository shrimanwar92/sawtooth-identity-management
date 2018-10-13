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
const encoding_1 = require("./services/encoding");
const crypto_1 = require("crypto");
const protobuf_1 = require("sawtooth-sdk/protobuf");
const axios_1 = require("axios");
const CONSTANTS = require("./services/constants");
const addressing_1 = require("./services/addressing");
function asymmetricEncryptDocumentpassword(publicKey, documentPasword) {
    return __awaiter(this, void 0, void 0, function* () {
        // asymmetric encrypt the document password so user with private key can decrypt it
        const obj = {};
        const encryptedPassword = yield encoding_1.AsymmetricEncryption.encrypt(publicKey, documentPasword);
        obj[publicKey] = encryptedPassword; // {'02eda3e96c40f148eb41aed4f9b480ec45164': '3298234wehkjrwhe=24982'}
        return obj;
    });
}
function encryptUserDocument(userDoc, publicKey) {
    return __awaiter(this, void 0, void 0, function* () {
        // generate document password and encrypt document
        const documentPassword = encoding_1.SymmetricEncryption.generateDocumentPwd(publicKey); // ex: 71hwouf1TEnUBM9ahZObYOHlcT0D3UQu91PcOVvrrTA=
        const encryptedDocument = encoding_1.SymmetricEncryption.encryptDocument(userDoc, documentPassword); // kshhaslahlhfk=&$hajkshfkja=, 123456
        try {
            const encryptedPwd = yield asymmetricEncryptDocumentpassword(publicKey, documentPassword);
            return {
                doc: encryptedDocument,
                pwd: encryptedPwd
            };
        }
        catch (err) {
            console.log(err);
            return err;
        }
    });
}
exports.encryptUserDocument = encryptUserDocument;
function createPayloadAndSend(action, encryptedDocument, approvedList, publicKeyHex, signer) {
    let payload = {
        action: action,
        data: encryptedDocument,
        approvedList: JSON.stringify(approvedList)
    };
    /*if(action == 'create' ||) {
        payload['approvedList'] = JSON.stringify(approvedList)
    }*/
    const payloadBytes = encoding_1.encode(payload);
    const address = addressing_1.default.getUserAddress(publicKeyHex);
    const transactionHeaderBytes = protobuf_1.TransactionHeader.encode({
        signerPublicKey: publicKeyHex,
        batcherPublicKey: publicKeyHex,
        familyName: CONSTANTS.FAMILY_NAME,
        familyVersion: CONSTANTS.FAMILY_VERSION,
        inputs: [address],
        outputs: [address],
        nonce: (Math.random() * Math.pow(10, 18)).toString(36),
        payloadSha512: crypto_1.createHash('sha512').update(payloadBytes).digest('hex')
    }).finish();
    const signature = signer.sign(transactionHeaderBytes);
    const transaction = protobuf_1.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: signature,
        payload: payloadBytes
    });
    const transactions = [transaction];
    const batchHeaderBytes = protobuf_1.BatchHeader.encode({
        signerPublicKey: signer.getPublicKey().asHex(),
        transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish();
    const signature2 = signer.sign(batchHeaderBytes);
    const batch = protobuf_1.Batch.create({
        header: batchHeaderBytes,
        headerSignature: signature2,
        transactions: transactions
    });
    const batchListBytes = protobuf_1.BatchList.encode({
        batches: [batch]
    }).finish();
    axios_1.default({
        url: 'http://localhost:8008/batches?wait',
        method: 'POST',
        data: batchListBytes,
        headers: { 'Content-Type': 'application/octet-stream' }
    });
}
exports.createPayloadAndSend = createPayloadAndSend;
