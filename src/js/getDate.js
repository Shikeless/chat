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

export {
	getData
} 