"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("sawtooth-sdk/processor/handler");
const exceptions_1 = require("sawtooth-sdk/processor/exceptions");
const user_actions_1 = require("./actions/user.actions");
const encoding_1 = require("./services/encoding");
const FAMILY_NAME = 'kyc';
const FAMILY_VERSION = '0.1';
const NAMESPACE = '70d6c6';
class KycHandler extends handler_1.TransactionHandler {
    constructor() {
        console.log('Initializing kyc handler with namespace:', NAMESPACE);
        super(FAMILY_NAME, [FAMILY_VERSION], [NAMESPACE]);
    }
    apply(txn, context) {
        let payload = null;
        try {
            payload = encoding_1.decode(txn.payload);
        }
        catch (err) {
            throw new exceptions_1.InvalidTransaction(`Failed to decode payload: ${err}`);
        }
        const action = payload.action;
        const publicKey = txn.header.signerPublicKey;
        const signature = txn.signature;
        console.log(payload);
        if (action == 'create') {
            return user_actions_1.createUser(context, publicKey, payload);
        }
        else if (action == 'update') {
            return user_actions_1.updateUser(context, publicKey, payload);
        }
        else if (action == 'delete') {
            return user_actions_1.deleteUser(context, publicKey);
        }
        else if (action == 'approve') {
            return user_actions_1.approve(context, publicKey, payload);
        }
        else if (action == 'reject') {
            return user_actions_1.reject(context, payload.publicKey);
        }
    }
}
exports.default = KycHandler;
