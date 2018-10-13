import { getData } from './get-data';
import Storage from './../services/storage';
import Addressing from './../services/addressing';
import { encode, decode, AsymmetricEncryption, SymmetricEncryption } from './../services/encoding';
import axios from 'axios';
import { createPayloadAndSend } from './../transaction-builder';

const storage = new Storage();

revoke();

// revoke Bobby's access from Alice's approved list so she can't access Alice's data
async function revoke() {
	// get Bobby's address
	const bobby = await storage.getUserPublicKey('Bobby');

	// Login Alice in the system and remove Bobby's public key from approved list
	const alice = await storage.getUserAddress('Alice');

	const response = await axios.get(`http://localhost:8008/state?address=${alice.address}`);
	const decodedData = decode(response.data.data[0].data);
	let approvedList = JSON.parse(decodedData.approvedList);

	if(approvedList[bobby.toString().trim()]) {
		delete approvedList[bobby.toString().trim()];
	}

	createPayloadAndSend('update', decodedData.user, approvedList, alice.publicKey, alice.signer);
}