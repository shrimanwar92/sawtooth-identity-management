import { spawn } from 'child_process';
import {PythonShell} from 'python-shell';


let runPy = (data) => new Promise((resolve, reject) => {

	let pyshell = new PythonShell('test.py');

	pyshell.send(JSON.stringify(data));

	pyshell.on('message', function (message) {
    	// received a message sent from the Python script (a simple "print" statement)
    	console.log(message);
    	resolve(message.toString());

	});

	// end the input stream and allow the process to exit
	pyshell.end(function (err) {
	    if (err){
	        console.log(err)
	    };
	});
});

async function encrypt(publicKey, payload): Promise<any> {
	const data = {
		action: 'encrypt',
		publicKey: publicKey,
		payload: payload
	};
	return await runPy(data);
}

async function decrypt(privateKey, payload): Promise<any> {
	const data = {
		action: 'decrypt',
		privateKey: privateKey,
		payload: payload
	};
	return await runPy(data);
}

export { encrypt, decrypt };

