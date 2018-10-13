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
const storage = new storage_1.default();
register();
function register() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const alice = yield storage.generateAddress('Alice');
            console.log('Alice public key: ' + alice['publicKey']);
            buildUser('Alice', alice);
            const bobby = yield storage.generateAddress('Bobby');
            console.log('Bobby public key: ' + bobby['publicKey']);
            buildUser('Bobby', bobby);
            const cathy = yield storage.generateAddress('Cathy');
            console.log('Cathy public key: ' + cathy['publicKey']);
            buildUser('Cathy', cathy);
        }
        catch (e) {
            console.log(e);
            return e;
        }
    });
}
function buildUser(name, addr) {
    const user = {
        firstName: name,
        lastName: name + name + 'xcf',
        gender: 'female',
        dob: `unix-timestamp-${Math.floor(Math.random() * 90000) + 10000}`,
        aadhar: `aadhar-${Math.floor(Math.random() * 90000) + 10000}`,
        pan: `pan-${Math.floor(Math.random() * 90000) + 10000}`
    };
    console.log('\n');
    console.log(user);
    console.log('\n');
    send('create', user, addr['publicKey'], addr['signer']);
    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        console.log('\n');
        console.log(`View ${name} data from the blockchain.`);
        console.log('\n');
        get_data_1.getData(addr['address'], addr['publicKey'], addr['privateKey']);
    }), 6000);
}
function send(action, user, pub, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n');
        console.log(`Encrypting ${user.firstName} document...`);
        console.log('\n');
        const data = yield transaction_builder_1.encryptUserDocument(user, pub);
        console.log('\n');
        console.log(data);
        console.log('\n');
        transaction_builder_1.createPayloadAndSend(action, data.doc, data.pwd, pub, signer);
    });
}
