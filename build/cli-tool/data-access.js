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
const get_data_1 = require("./get-data");
const storage_1 = require("./../services/storage");
const addressing_1 = require("./../services/addressing");
const storage = new storage_1.default();
accessData();
//Bobby's trying to access Alics's data
function accessData() {
    return __awaiter(this, void 0, void 0, function* () {
        // get Alice's address
        const alice = yield storage.getUserPublicKey('Alice');
        const aliceAddr = addressing_1.default.getUserAddress(alice.toString().trim());
        console.log('\n');
        console.log("Bobby's trying to access Alics's data");
        // Login Bobby in the system and access Alice's data
        const bobby = yield storage.getUserAddress('Bobby');
        get_data_1.getData(aliceAddr, bobby['publicKey'], bobby['privateKey']);
    });
}
