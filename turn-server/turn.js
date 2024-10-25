const Turn = require('node-turn');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('turn-config.json'));

const turnServer = new Turn({
    listeningPort: config.listeningPort,
    listeningIps: config.listeningIps,
    relayCredentials: config.relayCredentials
});

turnServer.start();
console.log('TURN server started on port', config.listeningPort);
