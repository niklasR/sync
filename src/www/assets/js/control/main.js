$(document).ready(function() {
	
	var baseUrl = $("body").attr("data-baseurl");
	var $currentTime = $(".data-currenttime").first();
	var currentTimeTxt = null;
	
	String.prototype.pad = function(padString, length) {
		var str = this;
		while (str.length < length)
			str = padString + str;
		return str;
	}
	
	var getDateTimestampForInput = function(d) {
		return d.getFullYear()+"-"+(d.getMonth()+1).toString().pad("0", 2)+"-"+d.getDate().toString().pad("0", 2)+"T"+d.getHours().toString().pad("0", 2)+":"+d.getMinutes().toString().pad("0", 2)+":"+d.getSeconds().toString().pad("0", 2);
	};
	
	var getTime = function() {
		return getSynchronisedTime().getTime();
	};
	
	var convertToUTC = function(d) {
		return new Date(d.getTime() + (d.getTimezoneOffset()*60*1000));
	}
	
	var getUnixTime = function(val) {
		return Math.ceil(val/1000);
	}
	
	var updateTimeTxt = function() {
		var time = getTime();
		var date = new Date(time);
		var txt = date.getHours().toString().pad("0", 2)+":"+date.getMinutes().toString().pad("0", 2)+":"+date.getSeconds().toString().pad("0", 2);
		
		if (txt === currentTimeTxt) {
			return;
		}
		$currentTime.text(txt);
		currentTimeTxt = txt;
	};
	updateTimeTxt();
	setInterval(updateTimeTxt, 200);
	
	
	$(".main-table tr[data-id]").each(function() {
		var self = this;
	
		var id = parseInt($(this).attr("data-id"), 10);
		
		var $name = $(this).find(".data-name").first();
		var $instruction = $(this).find(".data-instruction").first();
		var $offset = $(this).find(".data-offset").first();
		var $countdownTo = $(this).find(".data-countdownto").first();
		var $saveBtn = $(this).find(".data-savebtn").first();
		var $delBtn = $(this).find(".data-delbtn").first();
		var $startBtn = $(this).find(".data-startbtn").first();
		var $cancelBtn = $(this).find(".data-cancelbtn").first();
		var $calculateCountdown = $(this).find(".data-calculatecountdown").first();
		var $countdownTxt = $(this).find(".data-countdowntxt").first();
		var countdownTxtVal = null;
		var flashTime = null;
		var flashTimeDelay = 8000;
		var humanReactionTime = 215; // http://www.humanbenchmark.com/tests/reactiontime/stats.php
		
		var calculateTimeState = 0; //0=not calculating 1=calculating
		var calculateTimeStartTime = null; // time flash will be triggered
		var calculateStartTimeRequestInProgress = false;
		var calculateStartTimeIgnoreClickEvent = false;
		
		var changed = false;
		var changedSincePost = false;
		
		var enterKeyListener = function(e) {
			
			if (e.which !== 13) {
				return;
			}
			save();
		};
		
		var getCountdownToTime = function() {
			var val = $countdownTo.val();
			var time = val !== "" ? convertToUTC(new Date(val)).getTime() : null;
			return time;
		};
		
		$(this).on("change", function() {
			if (!changed) {
				$(self).addClass("danger");
				changed = true;
			}
		});
		
		var updateStartBtn = function() {
			if (calculateTimeState === 0) {
				$startBtn.text("Start");
			}
			else if (calculateTimeState === 1) {
				$startBtn.text("Click When See Flash");
			}
		};
		updateStartBtn();
		
		$name.keypress(enterKeyListener);
		$instruction.keypress(enterKeyListener);
		$offset.keypress(enterKeyListener);
		$countdownTo.keypress(enterKeyListener);
		
		$calculateCountdown.keypress(function(e) {
			
			if (e.which !== 13) {
				return;
			}
			
			var val = parseInt($(this).val(), 10);
			
			if (isNaN(val)) {
				return;
			}
			$countdownTo.val(getDateTimestampForInput(new Date(getTime() + (val*1000))));
			save();
		});
		
		$saveBtn.click(function() {
			save();
		});
		
		$delBtn.click(function() {
			if (!confirm("Are you sure you want to delete this?")) {
				return;
			}
			
			// create form and submit
			var data = {
				action: "delete",
				id: id,
				form_submitted: "1"
			};
			
			var $form = $("<form />").attr("method", "post").attr("action", "").addClass("hidden");
			for (var key in data) {
				$el = $('<input />').attr("type", "hidden").attr("name", key).val(data[key]);
				$form.append($el);
			}
			
			$("body").append($form);
			$form.submit();
		});
		
		
		$startBtn.on("mousedown click", function(e) {
			
			if (calculateStartTimeIgnoreClickEvent) {
				calculateStartTimeIgnoreClickEvent = false;
				return;
			}
			
			// only trigger on mouse down if state is 1
			if (calculateTimeState !== 1 && e.type !== "click") {
				return;
			}
			
			if (e.type === "mousedown") {
				calculateStartTimeIgnoreClickEvent = true;
			}
			
			if (calculateStartTimeRequestInProgress) {
				return;
			}
			
			if (calculateTimeState === 0) { //not calculating
				var flashTime = getUnixTime(getTime() + flashTimeDelay)*1000; // make sure it's rounded to unix time
				calculateStartTimeRequestInProgress = true;
				jQuery.ajax({
					url: baseUrl+"/control/ajax.php",
					cache: false,
					data: {
						action: "setFlashTime",
						data: {
							id: id,
							flashTime: getUnixTime(flashTime)
						}
					},
					dataType: "json",
					timeout: 5000,
					type: "POST"
				}).done(function(data) {
					calculateTimeStartTime = flashTime;
					calculateTimeState = 1;
					updateStartBtn();
				}).fail(function() {
					console.log("An ajax error occurred.");
				}).always(function() {
					calculateStartTimeRequestInProgress = false;
				});
			}
			else if (calculateTimeState === 1) {
				var offset = getTime() - calculateTimeStartTime - humanReactionTime;
				if (offset < 0) {
					alert("That was not possible!");
				}
				else {
					$offset.val(offset);
					save();
				}
				calculateTimeState = 0;
				updateStartBtn();
			}
		});
		
		$cancelBtn.click(function() {
			if (calculateTimeState === 1) {
				calculateTimeState = 0;
				updateStartBtn();
			}
		});
		
		var save = function() {
			
			changedSincePost = false;
			countdownTime = getCountdownToTime();
			jQuery.ajax({
				url: baseUrl+"/control/ajax.php",
				cache: false,
				data: {
					action: "save",
					data: {
						id: id,
						name: $name.val(),
						instruction: $instruction.val(),
						offset: $offset.val(),
						countdownTo: countdownTime === null ? null : getUnixTime(countdownTime)
					}
				},
				dataType: "json",
				timeout: 5000,
				type: "POST"
			}).done(function(data) {
				if (data.success) {
					if (!changedSincePost) {
						$(self).removeClass("danger");
						changed = false;
					}
				}
			}).fail(function() {
				console.log("An ajax error occurred.");
			});
		};
		
		var updateCountdown = function() {
			var txt = "?";
			if (getCountdownToTime() !== null) {
				txt = Math.ceil((getCountdownToTime() - getTime())/1000);
			}
			if (txt === countdownTxtVal) {
				return;
			}
			$countdownTxt.text(txt);
			countdownTxtVal = txt;
		};
		updateCountdown();
		setInterval(updateCountdown, 200);
		
	});

});