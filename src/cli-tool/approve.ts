import { getData } from './get-data';
import Storage from './../services/storage';
import Addressing from './../services/addressing';
import { encode, decode, AsymmetricEncryption, SymmetricEncryption } from './../services/encoding';
import axios from 'axios';
import { createPayloadAndSend } from './../transaction-builder';

const storage = new Storage();

approve();

// Add Bobby to Alice's approved list so Bobby can access Alice's data
async function approve() {
	// get Bobby's address
	const bobby = await storage.getUserPublicKey('Bobby');

	// Login Alice in the system and add Bobby's public key to approved list
	const alice = await storage.getUserAddress('Alice');

	const response = await axios.get(`http://localhost:8008/state?address=${alice.address}`);
	const decodedData = decode(response.data.data[0].data);
	let approvedList = JSON.parse(decodedData.approvedList);

	// get document password from Alice's private key
	const pwd = await AsymmetricEncryption.decrypt(alice.privateKey, approvedList[alice.publicKey]);

	// encrypt password with Bobby's public key
	const encPwd = await AsymmetricEncryption.encrypt(bobby.toString().trim(), pwd);

	// add bobby to approved list
	approvedList[bobby] = encPwd;

	console.log("Adding Bobby to Alice's approved list.");

	createPayloadAndSend('update', decodedData.user, approvedList, alice.publicKey, alice.signer);

}