import * as crypto from 'crypto';
import EthCrypto from 'eth-crypto';

const ALGORITHM = 'aes-256-ctr';

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
        const encrypted = await EthCrypto.encryptWithPublicKey(publicKeyHex, JSON.stringify(payload));
        return EthCrypto.cipher.stringify(encrypted);
    }

    static async decrypt(privateKeyHex: string, encryptedString: string): Promise<string> {
        const encryptedObject = EthCrypto.cipher.parse(encryptedString);
        const decrypted = await EthCrypto.decryptWithPrivateKey(privateKeyHex, encryptedObject);
        return JSON.parse(decrypted);
        /*return await EthCrypto.decryptWithPrivateKey( privateKeyHex, {
            iv: encryptedData.iv,
            ephemPublicKey: encryptedData.ephemPublicKey,
            ciphertext: encryptedData.ciphertext,
            mac: encryptedData.mac
        });*/
    }
}

const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()))
const decode = base64Str => JSON.parse(Buffer.from(base64Str, 'base64').toString());


export { SymmetricEncryption, AsymmetricEncryption, encode, decode };