const CHAR_RETURN = 13;

const socket = new WebSocket('ws://127.0.0.1:3000');
const chat = document.getElementById('chat-list');
const msg = document.getElementById('mes');
const stat = document.getElementById('status');
const send = document.getElementById('send');
const log = document.getElementById('log');
const name = document.getElementById('name');
const nickName = document.getElementById('nickName');
const message = document.getElementById('message');
const userName = document.getElementById('user-name');
const form = document.getElementById('login');
const list = document.getElementById('member-list');
const numb = document.getElementById('member-number');
var users = { list:[] };
const currentUser = {};

const writeLine = text => {
	const post = document.createElement('div');
	const p1 = document.createElement('p');
	const p2 = document.createElement('p');
	p1.innerHTML = `<b>${text.name}</b>  ${text.time}`;
	p2.innerHTML = `${text.dat}`;
	post.appendChild(p1);
	post.appendChild(p2);
	chat.appendChild(post);
};

const buildUserList = text => {
	users.list.push(text)

	numb.innerHTML = `<b>Участники ( ${users.list.length} )</b>`
	const p = document.createElement('p');
	p.innerHTML = text.name;
	list.appendChild(p)
}



// socket.onopen = () => {
// 	console.log('online')
// }

socket.onclose = () => {
	for (user of users.list) {  //передавать данные удаленного узера через вебсокет, и обновлять users через onmessage у всех остальных 

	}
};

socket.onmessage = event => {
	console.log(event.data);
	const datt = JSON.parse(event.data);
	if (datt.id === 'm') {
		writeLine(datt);
	} else if (datt.id === 'u') {
		buildUserList(datt);
	}
};


msg.addEventListener('keydown', event => {
	if (event.keyCode === CHAR_RETURN) {
		const cont = mes.value;
		mes.value = '';
		var time = getData()
		socket.send(JSON.stringify({
			id:'m',
			dat: cont,
			name: currentUser.name,
			time: time
		}));
	}
});

// send.addEventListener('click', event => {
// 	const s = mes.value;
// 	mes.value = '';
// 	writeLine(s);
// 	socket.send(s);	
// });

log.addEventListener('click', event => {
	if (name.value.length < 3 || nickName.value.length < 3)  {
		alert('ФИО и никнейм должны быть не короче 4 символов');
	} else {
		form.style = "display: none;"
		message.style = "display: block"
		currentUser.name = name.value;
		currentUser.nickname = nickName.value;
		userName.innerHTML = `<b>${currentUser.name}</b>`
		socket.send(JSON.stringify({
			id: 'u',
			name: name.value,
			nick: nickName.value
		}));
	}
})

function getData() {
    var todayTime = new Date();

    var hour = todayTime .getHours();

    var minute = todayTime .getMinutes();
    if (minute.toString().length < 2) {
    	minute = `0${minute}`
    }

    var second = todayTime .getSeconds();
    if (second.toString().length < 2) {
    	second = `0${second}`
    }

    return hour + "." + minute + "." + second;
}
