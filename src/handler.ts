import { TransactionHandler } from 'sawtooth-sdk/processor/handler';
import { InvalidTransaction } from 'sawtooth-sdk/processor/exceptions';
import { createUser, updateUser, deleteUser, approve, reject } from './actions/user.actions';
import { encode, decode } from './services/encoding';
import AddressStore from './services/addressing';
import { createHash } from 'crypto';

const FAMILY_NAME: string = 'kyc';
const FAMILY_VERSION: string = '0.1';
const NAMESPACE: string = '70d6c6';

export default class KycHandler extends TransactionHandler {
  
  constructor () {
    console.log('Initializing kyc handler with namespace:', NAMESPACE);
    super(FAMILY_NAME, [ FAMILY_VERSION ], [ NAMESPACE ]);
  }

  apply (txn, context) {
    let payload = null;
    try {
      payload = decode(txn.payload);
    } catch (err) {
      throw new InvalidTransaction(`Failed to decode payload: ${err}`);
    }

    const action: string = payload.action;
    const publicKey: string = txn.header.signerPublicKey;
    const signature: string = txn.signature;

    console.log(payload);

    if (action == 'create') {
      return createUser(context, publicKey, payload);
    } else if (action == 'update') {
      return updateUser(context, publicKey, payload);
    } else if (action == 'delete') {
      return deleteUser(context, publicKey);
    } else if (action == 'approve') {
      return approve(context, publicKey, payload);
    } else if (action == 'reject') {
      return reject(context, payload.publicKey);
    }
  }
}