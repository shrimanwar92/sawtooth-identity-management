import * as crypto from 'crypto';
import * as ecies from 'standard-ecies';

const ALGORITHM = 'aes-256-ctr';

const options = {
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

class SymmetricEncryption {

  static generateDocumentPwd(pubKey: string): string {
      return crypto.createHash('sha256').update(pubKey).digest('base64');
  }

  static encryptDocument(data: any, pwd: string): string {
      return crypto.createCipher(ALGORITHM, pwd).update(JSON.stringify(data), "utf8", "hex");
  }

  static decryptDocument(data: any, pwd: string): string {
      return crypto.createDecipher(ALGORITHM, pwd).update(data, "hex", "utf8");
  }
}


class AsymmetricEncryption {

    static async encrypt(publicKeyHex: string, payload: any): Promise<string> {
        const bufferedPayload = Buffer.from(payload.toString());
        return ecies.encrypt(Buffer.from(publicKeyHex, 'hex'), bufferedPayload, options);
    }

    static async decrypt(privateKeyHex: string, encryptedText: any): Promise<string> {
        const ecdh = crypto.createECDH(options.curveName);
        ecdh.setPrivateKey(privateKeyHex, 'hex');
        return ecies.decrypt(ecdh, encryptedText, options);
    }
}

const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()))
const decode = base64Str => JSON.parse(Buffer.from(base64Str, 'base64').toString());


export { SymmetricEncryption, AsymmetricEncryption, encode, decode };