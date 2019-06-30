const CHAR_RETURN = 13;

const socket = new WebSocket('ws://127.0.0.1:8080'); //проверить адресс
const chat = document.getElementById('chat-list');
const msg = document.getElementById('mes');
const stat = document.getElementById('status');
const but = document.getElementById('send');
mes.focus();

const writeLine = text => {
	const line = document.createElement('li');
	line.innerHTML = `${text}`;
	chat.appendChild(line);
};

socket.onopen = () => {
	stat.innerHTML = 'online';
}

socket.onclose = () => {
	stat.innerHTML = 'offline';
}

socket.onmessage = event => {
	writeLine(event.data);
};

msg.addEventListener('keydown', event => {
	if (event.keyCode === CHAR_RETURN) {
		const s = mes.value;
		mes.value = '';
		writeLine(s);
		socket.send(s);	
	}
});

but.addEventListener('click', event => {
	console.log(but);
	const s = mes.value;
	mes.value = '';
	writeLine(s);
	socket.send(s);	
});
