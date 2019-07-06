const fs = require('fs');
const http = require('http');
const Websocket = require('websocket').server;

const server = http.createServer((req, res) => {
});

server.listen(3000, () => {
	console.log('listen port 3000');
});

const ws = new Websocket({
	httpServer: server,
	maxReceivedFrameSize: 512 * 1024,
    maxReceivedMessageSize: 10 * 1024 * 1024,
	autoAcceptConnections: false
});

function sendUsers(users) {
	const stringifyData = JSON.stringify(users);
	clients.forEach(client => {
			client.send(stringifyData);
	});
}

const timestamp = () => {
	var d = new Date();
	var n = d.getTime();
	return n;
}

const clients = [];

const users = {id: 'u', list: []};

ws.on('request', req => {
	const connection = req.accept('', req.origin);

	connection.id = timestamp();

	clients.push(connection);

	console.log('Connected' + connection.remoteAddress);

	connection.on('message', message => {
		const dataName = message.type + 'Data';

		const data = message[dataName];

		const parsedData = JSON.parse(data);

		if (parsedData.id === 'a') {
			parsedData.clientId = connection.id;
			users.list.push(parsedData);
			sendUsers(users)
		} else if (parsedData.id === 'c') {
			sendUsers(users)
		} else if (parsedData.id === 'd') {
			for (var i = 0; i < users.list.length; i++) {
				if (parsedData.name === users.list[i]) {
					users.list.splice(i, 1);
					sendUsers(users);
				}
			};
		} else if (parsedData.id === 'i') {
			for (var i = 0; i < users.list.length; i++) {
				if (connection.id === users.list[i].clientId) {
					users.list[i].image = parsedData.body;
				}
			};
		} else if (parsedData.id === 'm') {
			for (var i = 0; i < users.list.length; i++) {
				if (connection.id === users.list[i].clientId) {
					const msg = JSON.stringify({
						id: parsedData.id,
						dat: parsedData.dat,
						time: parsedData.time,
						name: users.list[i].name,
						image: users.list[i].image,
					})
					clients.forEach(client => {
						client.send(msg);
					});
				}
			};
		}
	});

	connection.on('close', (message, reasonCode, description) => {
		console.log('Disconnected ' + connection.remoteAddress);

		console.dir({ reasonCode, description });

		for (var i = 0; i < users.list.length; i++) {
			if (connection.id === users.list[i].clientId) {
				users.list.splice(i, 1);
				sendUsers(users);
			}
		};

	});

});


