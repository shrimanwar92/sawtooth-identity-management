/*import Storage from './services/storage';
import { createPayloadAndSend, encryptUserDocument } from './transaction-builder';

const storage = new Storage();

console.log('Registering Alice ....');
storage.generateAddress('alice').then(ali => {
	console.log('\n');
	console.log('Alice public key: '+ali['publicKey']);
	console.log('\n');

	const alice = {
	    firstName: 'Alice',
	    lastName: 'Doe',
	    gender: 'female',
	    dob: '3298294286469823',
	    aadhar: '2342342342342',
	    pan: '234234234'
	}
	console.log('\n');
	console.log(alice);
	console.log('\n');

	send('create', alice, ali['publicKey'], ali['signer']);
	setTimeout(() => {
		console.log('\n');
		console.log('Alice created successfully.');
		console.log('\n');

		console.log('\n');
		console.log('Updating Alice');
		console.log('\n');
		updateAlice();
	}, 6000);
});

async function updateAlice() {
	const alice = {
	    firstName: 'test',
	    lastName: 'test',
	    gender: 'test',
	    dob: 'test',
	    aadhar: 'test',
	    pan: 'test'
	}

	console.log('\n');
	console.log(alice);
	console.log('\n');

	const usr = await storage.getUserAddress('alice');
	send('update', alice, usr['publicKey'], usr['signer']);	
	setTimeout(() => {
		console.log('\n');
		console.log('View Alice data.');
		console.log('\n');
		getData(usr['address'], usr['publicKey'], usr['privateKey']);
	}, 6000);
}

async function send(action, user, pub, signer) {
	console.log('\n');
	console.log("Encrypting Alice's document...");
	console.log('\n');
	const data = await encryptUserDocument(user, pub);

	console.log('\n');
	console.log(data);
	console.log('\n');

	createPayloadAndSend(action, data.doc, data.pwd, pub, signer);
}*/

import { encode, decode, AsymmetricEncryption, SymmetricEncryption } from './../services/encoding';
import axios from 'axios';

export function getData(addr, pub, pri) {
  	axios.get(`http://localhost:8008/state?address=${addr}`).then(response => {
		const data = decode(response.data.data[0].data);
	    let approvedList = JSON.parse(data.approvedList);

	    // id public key is not in approved list means, that user has not access to the data
	    if(approvedList[pub] == undefined) {
	    	console.log('You do not have access to data. Access denied.');
	    }
	    AsymmetricEncryption.decrypt(pri, approvedList[pub]).then(dec => {
	    	console.log('\n');
	      	console.log(dec);

	      	var d = JSON.parse(SymmetricEncryption.decryptDocument(data.user, dec));
	      	
	      	console.log('\n');
	      	console.log(d);
	    }).catch(err => {
	    	console.log(err);
	    	throw new Error(err);
	    });
  	});
}

// getData();
