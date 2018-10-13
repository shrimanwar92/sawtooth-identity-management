import Storage from './../services/storage';
import { createPayloadAndSend, encryptUserDocument } from './../transaction-builder';
import { getData } from './get-data';

const storage = new Storage();
register();

async function register() {

	try {
		const alice = await storage.generateAddress('Alice');
		console.log('Alice public key: '+alice['publicKey']);
		buildUser('Alice', alice);

		const bobby = await storage.generateAddress('Bobby');
		console.log('Bobby public key: '+bobby['publicKey']);
		buildUser('Bobby', bobby);

		const cathy = await storage.generateAddress('Cathy');
		console.log('Cathy public key: '+cathy['publicKey']);
		buildUser('Cathy', cathy);
	} catch (e) {
		console.log(e);
		return e;
	}
}

function buildUser(name, addr) {
	const user = {
	    firstName: name,
	    lastName: name + name + 'xcf',
	    gender: 'female',
	    dob: `unix-timestamp-${Math.floor(Math.random()*90000) + 10000}`,
	    aadhar: `aadhar-${Math.floor(Math.random()*90000) + 10000}`,
	    pan: `pan-${Math.floor(Math.random()*90000) + 10000}`
	}
	console.log('\n');
	console.log(user);
	console.log('\n');

	send('create', user, addr['publicKey'], addr['signer']);

	setTimeout(async() => {
		console.log('\n');
		console.log(`View ${name} data from the blockchain.`);
		console.log('\n');

		getData(addr['address'], addr['publicKey'], addr['privateKey']);

	}, 6000);
}

async function send(action, user, pub, signer) {
	console.log('\n');
	console.log(`Encrypting ${user.firstName} document...`);
	console.log('\n');
	const data = await encryptUserDocument(user, pub);

	console.log('\n');
	console.log(data);
	console.log('\n');

	createPayloadAndSend(action, data.doc, data.pwd, pub, signer);
}