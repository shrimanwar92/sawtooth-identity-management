/*var _a = require('sawtooth-sdk/signing');
var createContext = _a.createContext;
var CryptoFactory = _a.CryptoFactory;
var crypto = require('crypto');
var context = createContext('secp256k1');

var privateKey = context.newRandomPrivateKey();
var signer = new CryptoFactory(context).newSigner(privateKey);
var privateKeyHex = privateKey.asHex();
var publicKeyHex = signer.getPublicKey().asHex();

var privateKey1 = context.newRandomPrivateKey();
var signer1 = new CryptoFactory(context).newSigner(privateKey1);
var privateKeyHex1 = privateKey1.asHex();
var publicKeyHex1 = signer1.getPublicKey().asHex();

console.log('Alice public key: '+publicKeyHex);
console.log('Alice private key: '+privateKeyHex);
console.log();
console.log('Bob public key: '+publicKeyHex1);
console.log('Bob private key: '+privateKeyHex1);
console.log();


const alice = crypto.createECDH('secp256k1');
alice.setPrivateKey(privateKeyHex, 'hex');
const alice_secret = alice.computeSecret(publicKeyHex1, 'hex', 'hex');
console.log('Alice Secret: '+alice_secret);

const bob = crypto.createECDH('secp256k1');
bob.setPrivateKey(privateKeyHex1, 'hex');
const bob_secret = bob.computeSecret(publicKeyHex, 'hex', 'hex');
console.log('Bob Secret: '+bob_secret);
console.log(alice_secret == bob_secret);*/

const crypto = require('crypto');
const ecies = require('standard-ecies');
var _a = require('sawtooth-sdk/signing');
var createContext = _a.createContext;
var CryptoFactory = _a.CryptoFactory;
var context = createContext('secp256k1');

// option parameter is optional, all options are optional except iv,
// when symmetric cipher is not in ecb mode, iv option must be offered. 

// default options
var options = {
    hashName: 'sha256',
    hashLength: 32,
    macName: 'sha256',
    macLength: 32,
    curveName: 'secp256k1',
    symmetricCypherName: 'aes-256-ecb',
    iv: null, // iv is used in symmetric cipher, set null if cipher is in ECB mode. 
    keyFormat: 'uncompressed',
    s1: null, // optional shared information1
    s2: null // optional shared information2
}

var privateKey = context.newRandomPrivateKey();
var signer = new CryptoFactory(context).newSigner(privateKey);
var privateKeyHex = privateKey.asHex();
var publicKeyHex = signer.getPublicKey().asHex();

var privateKey1 = context.newRandomPrivateKey();
var signer1 = new CryptoFactory(context).newSigner(privateKey1);
var privateKeyHex1 = privateKey1.asHex();
var publicKeyHex1 = signer1.getPublicKey().asHex();

console.log('Alice public key: '+publicKeyHex);
console.log('Alice private key: '+privateKeyHex);
console.log();
console.log('Bob public key: '+publicKeyHex1);
console.log('Bob private key: '+privateKeyHex1);
console.log();

// Alice wants to send secret message to Bob
var plainText = Buffer.from('Some secret message');
var encryptedText = ecies.encrypt(Buffer.from(publicKeyHex1, 'hex'), plainText, options);
console.log(encryptedText);

// Bob decrypts the message
var bob = crypto.createECDH(options.curveName);
bob.setPrivateKey(privateKeyHex1, 'hex');
var decryptedText = ecies.decrypt(bob, encryptedText, options);
console.log(plainText.toString());