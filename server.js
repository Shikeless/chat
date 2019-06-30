// var http = require('http');

// const server = http.createServer((req, res) => {
// 	console.log(req.url);
// 	console.log(req.method);
// 	console.log(req.headers);

// 	res.writeHead(200, { 'Content-Type': 'text/plain' });
// 	res.end('Node.js');
// }).listen(8080, () => console.log('Сервер работает'));

const WebSocket = require('ws');

const server = new WebSocket.server({ port: 8080 });

server.on('connection', ws => {
	ws.send('Welcome');
})
