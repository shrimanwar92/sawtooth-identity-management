import { createHash } from 'crypto';
import { CryptoFactory, createContext } from 'sawtooth-sdk/signing';
import * as protobuf from 'sawtooth-sdk/protobuf';
import * as fs from 'fs';
import * as path from 'path';
import { Secp256k1PrivateKey } from 'sawtooth-sdk/signing/secp256k1';

class Storage {

	FAMILY: string = "sawtoothekyc";
	PREFIX: string = this.hash(this.FAMILY).substr(0, 6);

	async makeKeyPair(userName: string): Promise<boolean> {
		const context = createContext('secp256k1');
		const privateKey = context.newRandomPrivateKey();
		const signer = new CryptoFactory(context).newSigner(privateKey)
        const privateKeyHex = privateKey.asHex();
        const publicKeyHex = signer.getPublicKey().asHex();

        try {
        	fs.writeFileSync(path.resolve(__dirname, `./../keys/${userName}.priv`), privateKeyHex);
        	fs.writeFileSync(path.resolve(__dirname, `./../keys/${userName}.pub`), publicKeyHex);
        	return true;
        } catch (err) {
        	return err;
        }
    }

    async getUserPublicKey(userName: string): Promise<any> {
    	try {
    		return await fs.readFileSync(`${process.cwd()}/keys/${userName}.pub`);
    	} catch (err) {
    		return err;
    	}
    }

    async getUserPrivateKey(userName: string): Promise<any> {
    	try {
    		return await fs.readFileSync(`${process.cwd()}/keys/${userName}.priv`);
    	} catch (err) {
    		return err;
    	}
    }

    async generateAddress(userName: string): Promise<string> {
    	const keyPair = await this.makeKeyPair(userName);
    	if(keyPair) {
    		const address = await this.getUserAddress(userName);
    		return address.publicKey;
    	}
    }

    // Creates user address by reading public key file.
    async getUserAddress(userName: string): Promise<any> {
    	try {
    		const privKey = await this.getUserPrivateKey(userName);
	        const privateKeyStr = privKey.toString().trim();
	        const context = createContext('secp256k1');
	        const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);
	        const signer = new CryptoFactory(context).newSigner(privateKey);
	        const publicKey = signer.getPublicKey().asHex();
	        const address = this.PREFIX + this.hash(publicKey).substr(0, 64);
	        return {
	        	publicKey: address,
	        	signer: signer
	        }
    	} catch (err) {
    		return err;
    	}
    }

    hash(v: string): any {
    	return createHash('sha512').update(v).digest('hex');
	}
	
}

export default Storage;
