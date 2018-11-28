"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const index_1 = require("./index");
// import Storage from './services/storage';
const WebSocket = require("universal-websocket-client");
class App {
    constructor() {
        this.app = express();
        this.config();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        index_1.default();
        this.startWebSocket();
    }
    startWebSocket() {
        let ws = new WebSocket('ws:localhost:8008/subscriptions');
        console.log('opening websocket connection');
        ws.onopen = () => {
            console.log('websocket opened...');
            ws.send(JSON.stringify({
                'action': 'subscribe',
                'address_prefixes': ['70d6c6']
            }));
        };
        ws.onmessage = (data) => {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            const record = JSON.parse(data.data);
            console.log(record);
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        };
    }
}
const app = new App().app;
const PORT = 3001;
// const storage = new Storage();
app.listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
});
/*app.get('/signup', async (req: Request, resp: Response) => {
    /*const user = {
        firstName: 'asdf',
        lastName: 'asdf',
        dob: 'asdf',
        aadhar: 'asdf',
        pan: 'asdf',
        documents: []
    };
    //const userName = req.body.userName;
    const address = await storage.generateAddress('asdads123123');
    if (address) {
        resp.send({publicKey: address});
    }
    // resp.send({publicKey: 'asdasd'});
});

app.post('/signin', (req: Request, res: Response) => {
    
});*/ 
