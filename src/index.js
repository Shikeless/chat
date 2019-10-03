import { getData } from './js/getDate';
import { defaultImage } from './js/defaulImage';

const CHAR_RETURN = 13;
const socket = new WebSocket('ws://127.0.0.1:3000');
const chat = document.getElementById('chat-list');
const messageInput = document.getElementById('message-input');
const send = document.getElementById('send-button');
const log = document.getElementById('login-button');
const name = document.getElementById('name-input');
const nickName = document.getElementById('nick-name-input');
const message = document.getElementById('message');
const userName = document.getElementById('user-name');
const form = document.getElementById('login-window');
const list = document.getElementById('members-list');
const count = document.getElementById('members-count');
const userImage = document.getElementById('user-image');
const loadImageWindow = document.getElementById('load-image-window');
const dropArea = document.getElementById('load-image-layout');
const download = document.getElementById('download-button');
const cancel = document.getElementById('cancel-button');

var imageResult
const fileReader = new FileReader();
const currentUser = {};

window.onload = setDafaultImage();

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  	dropArea.addEventListener(eventName, preventDefaults, false)
});

['dragenter', 'dragover'].forEach(eventName => {
  	dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
  	dropArea.addEventListener(eventName, unhighlight, false)
});

dropArea.addEventListener('drop', handleDrop, false)

socket.onopen = event => {
	socket.send(JSON.stringify({
		id: 'c'
	}));
};

socket.onclose = event => {
	currentUser.id = 'd';
	socket.send(JSON.stringify(currentUser));
};

socket.onmessage = event => {
	const datt = JSON.parse(event.data);
	if (datt.id === 'm') {
		writeLine(datt);
	} else if (datt.id === 'u') {
		buildUserList(datt);
	}
};

function setDafaultImage() {
	userImage.src = defaultImage;
} 

function preventDefaults (e) {
  	e.preventDefault()
  	e.stopPropagation()
}

function highlight(e) {
	dropArea.classList.add('highlight')
};

function unhighlight(e) {
	dropArea.classList.remove('highlight')
};

function handleDrop(e) {
	let dt = e.dataTransfer
	let file = dt.files
	if (file[0].type !== 'image/jpeg' || file[0].size > 512 * 1024) {
		alert('Картинка должна быть в формате jpeg, и ее размер не должен привышать 512кб'); 
	} else {
		fileReader.readAsDataURL(file[0]);
	}
};

function sendMessage(e) {
	if (messageInput.value !== '') {
		const cont = messageInput.value;
		messageInput.value = '';
		var time = getData()
		socket.send(JSON.stringify({
			id:'m',
			dat: cont,
			time: time
		}));
	}
}

function writeLine(text) {
	const post = document.createElement('div');
	const postImg = document.createElement('div');
	const postMsg = document.createElement('div');
	post.classList.add('msg-block');
	postMsg.classList.add('msg-msg');
	postImg.classList.add('msg-image');
	const msgAvatar = document.createElement('img');
	msgAvatar.classList.add('msg-avatar');
	msgAvatar.src = text.image;

	const p1 = document.createElement('p');
	const p2 = document.createElement('p');
	p1.innerHTML = `<b>${text.name}</b>  ${text.time}`;
	p2.innerHTML = `${text.dat}`;
	postImg.appendChild(msgAvatar);
	postMsg.appendChild(p1);
	postMsg.appendChild(p2);
	post.appendChild(postImg);
	post.appendChild(postMsg);
	chat.appendChild(post);
};

const buildUserList = text => {
	count.innerHTML = `<b>Участники ( ${text.list.length} )</b>`
	list.innerHTML = '';
	for (const user of text.list) {
		const p = document.createElement('p');
		p.innerHTML = user.name;
		list.appendChild(p)
	}
}

messageInput.addEventListener('keydown', event => {
	if (event.keyCode === CHAR_RETURN) {
		sendMessage();
	}
});

send.addEventListener('click', event => {
	sendMessage();
});

download.addEventListener('click', e => {
	if (dropArea.style.backgroundImage === '') {
		alert('Сначала добавьте изображение');
	} else {
		userImage.src = imageResult;
		currentUser.image = imageResult;
		loadImageWindow.style = 'display: none;'
		socket.send(JSON.stringify({
		id: 'i',
		body: imageResult
	}));			
	}
})

cancel.addEventListener('click', e => {
	loadImageWindow.style = 'display: none;'
	if (userImage.src !== "./src/img/noImage.png") {
		dropArea.style = `background: #f0f0f0 url(); background-size: cover;`
		dropArea.innerHTML = 'Перетащите ваше фото сюда';
	}
})

log.addEventListener('click', event => {
	if (name.value.length < 4 || nickName.value.length < 4 || name.value.length > 25)  {
		alert('ФИО должно быть не короче 4 и не длиннее 25 символов. Никнейм должен быть не короче 4 символов.');
	} else {
		form.style = "display: none;"
		message.style = "display: block"
		currentUser.id = 'a';
		currentUser.name = name.value;
		currentUser.nickname = nickName.value;
		currentUser.image = defaultImage;
		userName.innerHTML = `<b>${currentUser.name}</b>`
		socket.send(JSON.stringify(currentUser));
		userImage.addEventListener('click', e => {
			preventDefaults(e);
			loadImageWindow.style = 'display: block';
		})
	}
})

fileReader.addEventListener('load', function() {
	dropArea.innerHTML = '';
	imageResult = fileReader.result;
	dropArea.style = `background: #f0f0f0 url(${fileReader.result}); background-size: cover;`
});
			



