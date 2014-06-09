$(document).ready(function() {

	var baseUrl = $("body").attr("data-baseurl");
	
	String.prototype.pad = function(padString, length) {
		var str = this;
		while (str.length < length)
			str = padString + str;
		return str;
	}
	
	$code = $(".code").first();
	$instruction = $(".instruction").first();
	$time = $(".time").first();
	$countdown = $(".countdown").first();
	var currentInstruction = null;
	var currentCode = null;
	var currentTime = null;
	var currentCountdown = null;
	var countdownToTime = null;
	var flashTime = null;
	var flashDone = false;
	var offsetTime = null;
	
	var getTime = function() {
		return getSynchronisedTime().getTime();
	};
	
	var setInstruction = function(txt) {
		if (txt === currentInstruction) {
			return;
		}
		$instruction.text(txt);
		currentInstruction = txt;
	};
	
	var setCode = function(code) {
		if (code === currentCode) {
			return;
		}
		$code.text(code);
		currentCode = code;
	};
	
	var updateTimeTxt = function() {
		var time = getVirtualTime();
		var txt = "[Not Calculated]";
		if (time !== null) {
			var date = new Date(time);
			txt = date.getHours().toString().pad("0", 2)+":"+date.getMinutes().toString().pad("0", 2)+":"+date.getSeconds().toString().pad("0", 2);
		}
		
		if (txt === currentTime) {
			return;
		}
		$time.text(txt);
		currentTime = txt;
	};
	
	var updateCountdownTxt = function() {
		var txt = "[No Countdown In Progress]";
		if (countdownToTime !== null) {
			txt = Math.ceil((countdownToTime - getVirtualTime())/1000)+" seconds";
		}
		
		if (txt === currentCountdown) {
			return;
		}
		$countdown.text(txt);
		currentCountdown = txt;
	};

	var setFlashTime = function(val) {
		if (flashTime !== val) {
			flashTime = val;
			flashDone = false;
		}
	};
	
	var animating = false;
	var flashScreen = function(txt) {
		if (animating) return;
		animating = true;
		$("body").css("background-color", "#ff0000");
		setTimeout(function() {
			$("body").css("background-color", "#000000");
			animating = false;
		}, 4000);
	};
	
	var getVirtualTime = function() {
		if (offsetTime === null) {
			return null;
		}
		return getTime() + offsetTime;
	};
	
	
	setInstruction("Loading...");
	updateTimeTxt();
	
	var update = function() {
		jQuery.ajax({
			url: baseUrl+"/ajax.php",
			cache: false,
			data: {action: "getData"},
			dataType: "json",
			timeout: 4500,
			type: "POST"
		}).done(function(data) {
			var payload = data.payload;
			setCode(payload.code);
			setInstruction(payload.instruction);
			countdownToTime = payload.countdownTo === null ? null : payload.countdownTo*1000;
			setFlashTime(payload.flashTime === null ? null : parseInt(payload.flashTime, 10)*1000);
			offsetTime = payload.offsetTime;
		}).fail(function() {
			console.log("An ajax error occurred.");
		});
	};
	
	
	update();
	setInterval(update, 5000);
	
	var timeCheckInterval = 200;
	var timeCheck = function() {
		var time = getTime();
		if (flashTime !== null && flashTime <= time && flashTime > time-timeCheckInterval && !flashDone) {
			flashScreen();
			flashDone = true;
		}
		updateTimeTxt();
		updateCountdownTxt();
	};
	
	setInterval(timeCheck, timeCheckInterval);
	
});