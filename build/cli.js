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
const storage_1 = require("./services/storage");
const transaction_builder_1 = require("./transaction-builder");
const storage = new storage_1.default();
console.log('Registering Alice ....');
storage.generateAddress('alice').then(ali => {
    console.log('\n');
    console.log('Alice public key: ' + ali['publicKey']);
    console.log('\n');
    const alice = {
        firstName: 'Alice',
        lastName: 'Doe',
        gender: 'female',
        dob: '3298294286469823',
        aadhar: '2342342342342',
        pan: '234234234'
    };
    console.log('\n');
    console.log(alice);
    console.log('\n');
    send('create', alice, ali['publicKey'], ali['signer']);
    setTimeout(() => {
        console.log('\n');
        console.log('Alice created successfully.');
        console.log('\n');
        console.log('\n');
        console.log('Updating Alice');
        console.log('\n');
        updateAlice();
    }, 6000);
});
function updateAlice() {
    return __awaiter(this, void 0, void 0, function* () {
        const alice = {
            firstName: 'test',
            lastName: 'test',
            gender: 'test',
            dob: 'test',
            aadhar: 'test',
            pan: 'test'
        };
        console.log('\n');
        console.log(alice);
        console.log('\n');
        const usr = yield storage.getUserAddress('alice');
        send('update', alice, usr['publicKey'], usr['signer']);
        setTimeout(() => {
            console.log('\n');
            console.log('View Alice data.');
            console.log('\n');
            getData(usr['address'], usr['publicKey'], usr['privateKey']);
        }, 6000);
    });
}
function send(action, user, pub, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n');
        console.log("Encrypting Alice's document...");
        console.log('\n');
        const data = yield transaction_builder_1.encryptUserDocument(user, pub);
        console.log('\n');
        console.log(data);
        console.log('\n');
        transaction_builder_1.createPayloadAndSend(action, data.doc, data.pwd, pub, signer);
    });
}
const encoding_1 = require("./services/encoding");
const axios_1 = require("axios");
function getData(addr, pub, pri) {
    axios_1.default.get(`http://localhost:8008/state?address=${addr}`).then(response => {
        const data = encoding_1.decode(response.data.data[0].data);
        // const pri = '4f6e55c28fa7344444397a1afd4f44c8e3d529f9541e58ba70d76a531f5db5ec';
        // const pub = '038fb57f49a1b4b9b41bd52762c2f427373c79fa2740e173ce7534865e2d3525f2';
        // const pwd = SymmetricEncryption.generateDocumentPwd(pub);
        // console.log(pwd);
        // var d = JSON.parse(SymmetricEncryption.decryptDocument(data.user, pwd));
        // console.log(d);
        console.log('\n');
        console.log(data);
        console.log('\n');
        let approvedList = JSON.parse(data.approvedList);
        encoding_1.AsymmetricEncryption.decrypt(pri, approvedList[pub]).then(dec => {
            console.log('\n');
            console.log(dec);
            console.log('\n');
            var d = JSON.parse(encoding_1.SymmetricEncryption.decryptDocument(data.user, dec));
            console.log('\n');
            console.log(d);
            console.log('\n');
        });
    });
}
// getData();
