import { getData } from './get-data';
import Storage from './../services/storage';
import Addressing from './../services/addressing';

const storage = new Storage();
accessData();

//Bobby's trying to access Alics's data
async function accessData() {
	// get Alice's address
	const alice = await storage.getUserPublicKey('Alice');
	const aliceAddr = Addressing.getUserAddress(alice.toString().trim());

	console.log('\n');
	console.log("Bobby's trying to access Alics's data");

	// Login Bobby in the system and access Alice's data
	const bobby = await storage.getUserAddress('Bobby');
	getData(aliceAddr, bobby['publicKey'], bobby['privateKey']);
}