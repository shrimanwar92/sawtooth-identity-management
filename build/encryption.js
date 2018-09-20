"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const python_shell_1 = require("python-shell");
let runPy = (data) => new Promise((resolve, reject) => {
    let pyshell = new python_shell_1.PythonShell('test.py');
    pyshell.send(JSON.stringify(data));
    pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
        resolve(message.toString());
    });
    // end the input stream and allow the process to exit
    pyshell.end(function (err) {
        if (err) {
            console.log(err);
        }
        ;
    });
});
function encrypt(publicKey, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {
            action: 'encrypt',
            publicKey: publicKey,
            payload: payload
        };
        return yield runPy(data);
    });
}
exports.encrypt = encrypt;
function decrypt(privateKey, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {
            action: 'decrypt',
            privateKey: privateKey,
            payload: payload
        };
        return yield runPy(data);
    });
}
exports.decrypt = decrypt;
