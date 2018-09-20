import { createHash } from 'crypto';

const NAMESPACE: string = '70d6c6';
const PREFIXES: any = {
	USER: '00'
};

class AddressStore {

	hash(str: string, length: number): string {
		return createHash('sha512').update(str).digest('hex').slice(0, length);
	}

	getUserAddress(publicKey: string): string {
		return NAMESPACE + PREFIXES.USER + this.hash(publicKey, 62);
	}

	isValidAddress(address: string): boolean {
		const pattern = `^${NAMESPACE}[0-9a-f]{64}$`;
		return new RegExp(pattern).test(address);
	}
}

export default new AddressStore();