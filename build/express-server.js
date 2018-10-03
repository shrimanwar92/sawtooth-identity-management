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
const express = require("express");
const bodyParser = require("body-parser");
const index_1 = require("./index");
const storage_1 = require("./services/storage");
class App {
    constructor() {
        this.app = express();
        this.config();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        index_1.default();
    }
}
const app = new App().app;
const PORT = 3001;
const storage = new storage_1.default();
app.listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
});
app.get('/signup', (req, resp) => __awaiter(this, void 0, void 0, function* () {
    /*const user = {
        firstName: 'asdf',
        lastName: 'asdf',
        dob: 'asdf',
        aadhar: 'asdf',
        pan: 'asdf',
        documents: []
    };*/
    //const userName = req.body.userName;
    const address = yield storage.generateAddress('asdads123123');
    if (address) {
        resp.send({ publicKey: address });
    }
    // resp.send({publicKey: 'asdasd'});
}));
app.post('/signin', (req, res) => {
});
