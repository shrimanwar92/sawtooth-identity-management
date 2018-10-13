import Storage from './../services/storage';
import { createPayloadAndSend, encryptUserDocument } from './../transaction-builder';
import { getData } from './get-data';
import axios from 'axios';
import { encode, decode, AsymmetricEncryption, SymmetricEncryption } from './../services/encoding';

const storage = new Storage();

updateUser();


async function updateUser() {
	const newAliceData = {
	    firstName: 'A1!lice',
	    lastName: 'Alice Surname',
	    gender: 'female',
	    dob: '15982639846982649',
	    aadhar: '328482348732',
	    pan: '9879898776',
	    edu: 'BE computers'
	}

	const alice = await storage.getUserAddress('Alice');
	const response = await axios.get(`http://localhost:8008/state?address=${alice.address}`);
	const decodedData = decode(response.data.data[0].data);
	let approvedList = JSON.parse(decodedData.approvedList);

	const data = await encryptUserDocument(newAliceData, alice.publicKey);

	if(approvedList[alice.publicKey] == undefined) {
		approvedList[alice.publicKey] = data.pwd;
	}

	createPayloadAndSend('update', data.doc, approvedList, alice.publicKey, alice.signer);

	setTimeout(async() => {
		console.log('\n');
		console.log("View Alice's updated data in the blockchain.");

		getData(alice['address'], alice['publicKey'], alice['privateKey']);

	}, 6000);
}

/*async function send(action, user, pub, signer) {
	console.log('\n');
	console.log("Encrypting Alice's document...");
	const data = await encryptUserDocument(user, pub);

	console.log('\n');
	console.log(data);
	console.log('\n');

	createPayloadAndSend(action, data.doc, data.pwd, pub, signer);
}*/