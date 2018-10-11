import { createHash } from 'crypto';
import * as CONSTANTS from './constants';

const PREFIXES: any = {
	USER: '00'
};

class AddressStore {

	hash(str: string, length: number): string {
		return createHash('sha512').update(str).digest('hex').slice(0, length);
	}

	getUserAddress(publicKey: string): string {
		return CONSTANTS.NAMESPACE + PREFIXES.USER + this.hash(publicKey, 62);
	}

	isValidAddress(address: string): boolean {
		const pattern = `^${CONSTANTS.NAMESPACE}[0-9a-f]{64}$`;
		return new RegExp(pattern).test(address);
	}
}

export default new AddressStore();