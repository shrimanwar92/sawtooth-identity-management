import { createHash } from 'crypto';
import { CryptoFactory, createContext } from 'sawtooth-sdk/signing';
import * as protobuf from 'sawtooth-sdk/protobuf';
import * as fs from 'fs';
import * as path from 'path';
import { Secp256k1PrivateKey } from 'sawtooth-sdk/signing/secp256k1';
import AddressStore from './addressing';

class Storage {

    rootPath: string = 'C:/Users/nshriman/Videos/sawtooth-kyc/'

	async makeKeyPair(userName: string): Promise<boolean> {
		const context = createContext('secp256k1');
		const privateKey = context.newRandomPrivateKey();
		const signer = new CryptoFactory(context).newSigner(privateKey)
        const privateKeyHex = privateKey.asHex();
        const publicKeyHex = signer.getPublicKey().asHex();

        try {
        	fs.writeFileSync(path.resolve(__dirname, `./../../keys/${userName}.priv`), privateKeyHex);
        	fs.writeFileSync(path.resolve(__dirname, `./../../keys/${userName}.pub`), publicKeyHex);
        	return true;
        } catch (err) {
        	return err;
        }
    }

    async getUserPublicKey(userName: string): Promise<any> {
    	try {
    		return await fs.readFileSync(path.resolve(__dirname, `./../../keys/${userName}.pub`));
    	} catch (err) {
    		return err;
    	}
    }

    async getUserPrivateKey(userName: string): Promise<any> {
    	try {
    		return await fs.readFileSync(path.resolve(__dirname, `./../../keys/${userName}.priv`));
    	} catch (err) {
    		return err;
    	}
    }

    async generateAddress(userName: string): Promise<any> {
    	const keyPair = await this.makeKeyPair(userName);
    	if(keyPair) {
            try {
                const address = await this.getUserAddress(userName);
                return address;
            } catch (err) {
                console.log(err);
                return err;
            }
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
	        const address = AddressStore.getUserAddress(publicKey);
	        return {
	        	address: address,
                publicKey: publicKey,
	        	signer: signer,
                privateKey: privateKeyStr
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
