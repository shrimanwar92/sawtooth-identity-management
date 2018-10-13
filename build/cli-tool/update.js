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
const transaction_builder_1 = require("./../transaction-builder");
const get_data_1 = require("./get-data");
const axios_1 = require("axios");
const encoding_1 = require("./../services/encoding");
const storage = new storage_1.default();
updateUser();
function updateUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const newAliceData = {
            firstName: 'A1!lice',
            lastName: 'Alice Surname',
            gender: 'female',
            dob: '15982639846982649',
            aadhar: '328482348732',
            pan: '9879898776',
            edu: 'BE computers'
        };
        const alice = yield storage.getUserAddress('Alice');
        const response = yield axios_1.default.get(`http://localhost:8008/state?address=${alice.address}`);
        const decodedData = encoding_1.decode(response.data.data[0].data);
        let approvedList = JSON.parse(decodedData.approvedList);
        const data = yield transaction_builder_1.encryptUserDocument(newAliceData, alice.publicKey);
        if (approvedList[alice.publicKey] == undefined) {
            approvedList[alice.publicKey] = data.pwd;
        }
        transaction_builder_1.createPayloadAndSend('update', data.doc, approvedList, alice.publicKey, alice.signer);
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            console.log('\n');
            console.log("View Alice's updated data in the blockchain.");
            get_data_1.getData(alice['address'], alice['publicKey'], alice['privateKey']);
        }), 6000);
    });
}
/*async function send(action, user, pub, signer) {
    console.log('\n');
    console.log("Encrypting Alice's document...");
    const data = await encryptUserDocument(user, pub);

    console.log('\n');
    console.log(data);
    console.log('\n');

    createPayloadAndSend(action, data.doc, data.pwd, pub, signer);
}*/ 
