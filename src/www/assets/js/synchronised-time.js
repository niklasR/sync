var getSynchronisedTime = null;
var getOffsetTime = null;
$(document).ready(function() {
	
	var baseUrl = $("body").attr("data-baseurl");
	
	// manage synchronised time
	
	var offsetTime = 0; // no of milliseconds out compared with local time
	var updateCount = 0;
	
	getSynchronisedTime = function() {
		return new Date(new Date().getTime() + offsetTime);
	};
	
	getOffsetTime = function() {
		return offsetTime;
	};
	
	function updateTimeOffset() {
		var requestStartTime = new Date().getTime();
		$.ajax({
			url: baseUrl+"/ajax.php",
			timeout: 3000,
			dataType: "json",
			data: {
				action: "getTime"
			},
			cache: false,
			type: "POST"
		}).done(function(data) {
			var currentTime = new Date().getTime();
			var roundTripTime = currentTime - requestStartTime;
			offsetTime = new Date(data.payload).getTime() - currentTime - (roundTripTime/2);
		}).always(function() {
			var delay;
			if (updateCount <= 5) {
				delay = 3000;
				updateCount++;
			}
			else {
				delay = 55000;
			}
			setTimeout(updateTimeOffset, delay);
		});
	}
	updateTimeOffset();

});

