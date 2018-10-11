import { encode, decode, AsymmetricEncryption, SymmetricEncryption } from './services/encoding';
import { createHash } from 'crypto';
import { Secp256k1PrivateKey } from 'sawtooth-sdk/signing/secp256k1';
import { createContext, CryptoFactory } from 'sawtooth-sdk/signing';
import { Transaction, TransactionHeader, Batch, BatchHeader, BatchList } from 'sawtooth-sdk/protobuf';
import axios from 'axios';
import * as CONSTANTS from './services/constants';


async function asymmetricEncryptDocumentpassword(publicKey, documentPasword) {
    // asymmetric encrypt the document password so user with private key can decrypt it
    const obj = {};
    const encryptedPassword = await AsymmetricEncryption.encrypt(publicKey, documentPasword);
    obj[publicKey] = encryptedPassword; // {'02eda3e96c40f148eb41aed4f9b480ec45164': '3298234wehkjrwhe=24982'}
    return obj;
}

async function encryptUserDocument(userDoc, publicKey) {
    // generate document password and encrypt document
    const documentPassword = SymmetricEncryption.generateDocumentPwd(publicKey); // ex: 71hwouf1TEnUBM9ahZObYOHlcT0D3UQu91PcOVvrrTA=
    const encryptedDocument = SymmetricEncryption.encryptDocument(userDoc, documentPassword); // kshhaslahlhfk=&$hajkshfkja=, 123456
    
    try {
        const encryptedPwd = await asymmetricEncryptDocumentpassword(publicKey, documentPassword);
        return {
            doc: encryptedDocument,
            pwd: encryptedPwd
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}



function createPayloadAndSend(action, encryptedDocument, obj, publicKeyHex, signer) {
    let payload = {
        action: action,
        data: encryptedDocument
    }

    if(action == 'create') {
        payload['approvedList'] = JSON.stringify(obj)
    }

    const payloadBytes = encode(payload);

    const transactionHeaderBytes = TransactionHeader.encode({
        signerPublicKey: publicKeyHex,
        batcherPublicKey: publicKeyHex,
        familyName: CONSTANTS.FAMILY_NAME,
        familyVersion: CONSTANTS.FAMILY_VERSION,
        inputs: [ CONSTANTS.NAMESPACE ],
        outputs: [ CONSTANTS.NAMESPACE ],
        nonce: (Math.random() * 10 ** 18).toString(36),
        payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
    }).finish()

    const signature = signer.sign(transactionHeaderBytes)

    const transaction = Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: signature,
        payload: payloadBytes
    });

    const transactions = [transaction]

    const batchHeaderBytes = BatchHeader.encode({
        signerPublicKey: signer.getPublicKey().asHex(),
        transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish()

    const signature2 = signer.sign(batchHeaderBytes)

    const batch = Batch.create({
        header: batchHeaderBytes,
        headerSignature: signature2,
        transactions: transactions
    });

    const batchListBytes = BatchList.encode({
        batches: [batch]
    }).finish()

    axios({
      url: 'http://localhost:8008/batches?wait',
      method: 'POST',
      data: batchListBytes,
      headers: { 'Content-Type': 'application/octet-stream' }
    });
}

export { createPayloadAndSend, encryptUserDocument };
