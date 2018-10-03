"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encoding_1 = require("./services/encoding");
const crypto_1 = require("crypto");
const protobuf_1 = require("sawtooth-sdk/protobuf");
const axios_1 = require("axios");
const FAMILY_NAME = 'kyc';
const FAMILY_VERSION = '0.1';
const NAMESPACE = '70d6c6';
/*const context = createContext('secp256k1');
const privateKey = context.newRandomPrivateKey();
// const privateKey = Secp256k1PrivateKey.fromHex('70ce1a5659f3b18ba7487d12912dd94878fc5a9cfbe6464a479bffd1633ef07a');
const signer = new CryptoFactory(context).newSigner(privateKey);
const privateKeyHex = privateKey.asHex();
const publicKeyHex = signer.getPublicKey().asHex();

console.log('public: '+publicKeyHex);
console.log('private: '+privateKeyHex);*/
/*async function asymmetricEncryptDocumentpassword(publicKey, documentPasword) {
    // asymmetric encrypt the document password so user with private key can decrypt it
    const obj = {};
    const encryptedPassword = await AsymmetricEncryption.encrypt(publicKeyHex, documentPasword);
    obj[publicKeyHex] = encryptedPassword;
    return obj;
}

// generate document password and encrypt document
const documentPassword = SymmetricEncryption.generateDocumentPwd(publicKeyHex);
const encryptedDocument = SymmetricEncryption.encryptDocument(user, documentPassword);

asymmetricEncryptDocumentpassword(publicKeyHex, documentPassword).then(obj => {
    // console.log(obj);
    createPayloadAndSend(encryptedDocument, obj);
});*/
function createPayloadAndSend(encryptedDocument, obj, publicKeyHex, signer) {
    let payload = {
        action: 'create',
        data: encryptedDocument,
        approvedList: JSON.stringify(obj)
    };
    const payloadBytes = encoding_1.encode(payload);
    const transactionHeaderBytes = protobuf_1.TransactionHeader.encode({
        signerPublicKey: publicKeyHex,
        batcherPublicKey: publicKeyHex,
        familyName: FAMILY_NAME,
        familyVersion: FAMILY_VERSION,
        inputs: [NAMESPACE],
        outputs: [NAMESPACE],
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
        url: 'http://localhost:8008/batches',
        method: 'POST',
        data: batchListBytes,
        headers: { 'Content-Type': 'application/octet-stream' }
    }).then(data => {
        console.log(data.data);
    });
}
/*function getData() {
  axios.get(`http://localhost:8008/state?address=70d6c6004f540c951b438e876601e2dbcfe601f1d8a10e13251af0b8cd8d962bfae7d7`).then(response => {
    const data = decode(response.data.data[0].data);
    const pri = '997dd7c3480a5220f8ae64f930c1a0dd0448a01d8233f4e7dba11acdf3d03c12';
    const pub = '02e65c56a989b3aeeb458c55b9bb14153d116bc795ca29551229fd4f143cdc3ae5';
    const pwd = SymmetricEncryption.generateDocumentPwd(pub);
    console.log(pwd);
    // var d = JSON.parse(SymmetricEncryption.decryptDocument(data.user, pwd));
    // console.log(d);
    
    let approvedList = JSON.parse(data.approvedList);
    AsymmetricEncryption.decrypt(pri, approvedList[pub]).then(dec => {
      console.log(dec);
      var d = JSON.parse(SymmetricEncryption.decryptDocument(data.user, dec));
      console.log(d);
    })
  });
}

getData();*/
