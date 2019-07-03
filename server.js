const fs = require('fs');
const http = require('http');
const Websocket = require('websocket').server;

const index = fs.readFileSync('./index.html');

const server = http.createServer((req, res) => {
	res.writeHead(200);
	res.end(index);
});

server.listen(8080, () => {
	console.log('listen port 8080');
});

const ws = new Websocket({
	httpServer: server,
	autoAcceptConnections: false
});

const clients = [];

ws.on('request', req => {
	const connection = req.accept('', req.origin);
	clients.push(connection);
	console.log('Connected' + connection.remoteAddress);
	console.log(clients);
	connection.on('message', message => {
		const dataName = message.type + 'Data';
		const data = message[dataName];
		console.dir(message);
		console.log('Recieved: ' + data);
		clients.forEach(client => {
			if (connection !== client) {
				client.send(data);
			}
		});
	});
	connection.on('close', (reasonCode, description) => {
		console.log('Disconnected ' + connection.remoteAddress);
		console.dir({ reasonCode, description });
	});
})