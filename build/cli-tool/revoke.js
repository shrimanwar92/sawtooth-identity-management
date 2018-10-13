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
const storage_1 = require("./../services/storage");
const encoding_1 = require("./../services/encoding");
const axios_1 = require("axios");
const transaction_builder_1 = require("./../transaction-builder");
const storage = new storage_1.default();
revoke();
// revoke Bobby's access from Alice's approved list so she can't access Alice's data
function revoke() {
    return __awaiter(this, void 0, void 0, function* () {
        // get Bobby's address
        const bobby = yield storage.getUserPublicKey('Bobby');
        // Login Alice in the system and remove Bobby's public key from approved list
        const alice = yield storage.getUserAddress('Alice');
        const response = yield axios_1.default.get(`http://localhost:8008/state?address=${alice.address}`);
        const decodedData = encoding_1.decode(response.data.data[0].data);
        let approvedList = JSON.parse(decodedData.approvedList);
        if (approvedList[bobby.toString().trim()]) {
            delete approvedList[bobby.toString().trim()];
        }
        transaction_builder_1.createPayloadAndSend('update', decodedData.user, approvedList, alice.publicKey, alice.signer);
    });
}
