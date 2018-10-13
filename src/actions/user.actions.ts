import { InvalidTransaction } from 'sawtooth-sdk/processor/exceptions';
import AddressStore from '../services/addressing';
import { encode, decode } from './../services/encoding';

async function createUser(context: any, publicKey: string, payload): Promise<any> {
  const address: string = AddressStore.getUserAddress(publicKey);

  try {
  	const state = await context.getState([address]);
  	const updates = {};
  	if (state[address].length > 0) {
        throw new InvalidTransaction(`Collection already exists with key: ${publicKey}`);
    }
  	updates[address] = encode({  owner: publicKey,  user: payload.data, approvedList: payload.approvedList });
    return context.setState(updates);

  } catch (err) {
  	throw new Error(err);
  }
}

async function updateUser (context: any, publicKey: string, payload: any): Promise<any> {
    const address: string = AddressStore.getUserAddress(publicKey);
    const updates = {};

    try {
        const state = await context.getState([address]);

        if(state[address].length == 0) {
            throw new InvalidTransaction(`User does not exist with key: ${publicKey}`);
        }

        const decodedUser = decode(state[address]);

        if(decodedUser['owner'] != publicKey) {
            throw new InvalidTransaction(`Update can be done by owner itself.`);
        }
        updates[address] = encode({  owner: publicKey,  user: payload.data, approvedList: payload.approvedList });
        return context.setState(updates);

    } catch (err) {
        throw new Error(err);
    }
}

async function approve (context: any, publicKey: string, payload: any): Promise<any> {
    const address: string = AddressStore.getUserAddress(publicKey);
    const updates = {};

    try {
        const state = await context.getState([address]);

        if(state[address].length == 0) {
            throw new InvalidTransaction(`User does not exist with key: ${publicKey}`);
        }

        const decodedUser = decode(state[address]);

        if(decodedUser['owner'] != publicKey) {
            throw new InvalidTransaction(`Update can be done by owner itself.`);
        }
        updates[address] = encode({  owner: publicKey,  user: decodedUser.user, approvedList: payload.approvedList });
        return context.setState(updates);

    } catch (err) {
        throw new Error(err);
    }
}

async function deleteUser (context: any, publicKey: string): Promise<any> {
    const address: string = AddressStore.getUserAddress(publicKey);
    try {
        const state = await context.getState([address]);
        if(state[address].length == 0) {
            throw new InvalidTransaction(`User does not exist with key: ${publicKey}`);
        }
        return context.deleteState([address]);

    } catch (err) {
        new Error(err);
    }
}

async function reject (context: any, publicKey: string): Promise<any> {

}

export { createUser, deleteUser, approve, reject, updateUser };