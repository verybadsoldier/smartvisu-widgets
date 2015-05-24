// this function sets the value to the web instantly and starts a timer to send the value delayed to the server
function deviceHmTc_setDelayed(uid, item, val) {
    widget.update(item, val);
    
    obj = $('#' + uid);
    
    // check if there is still a timer
    if (obj.prop("setDelayTimer") != undefined ){
        clearTimeout(obj.prop("setDelayTimer"));
        obj.removeProp("setDelayTimer");
    }
    
    // set timer to send the value delayed
    obj.prop("setDelayTimer", setTimeout(function(){ 
                                           io.write(item, val);
                                           $('#' + uid).removeProp("setDelayTimer");
                                         }, 1500));
                                         
}

$(document).delegate('div[data-widget="device.hmtc"] > div > a[data-icon="minus"]', {
    'click': function (event, response) {
        var uid = $(this).parent().parent().attr('id');
        var step = $('#' + uid).attr('data-step');
        var item = $('#' + uid + 'set').attr('data-item');
		var val = widget.get(item);

		var temp = 17.0;
		if ($.isNumeric(val)) {
			temp = (Math.round((val - step) * 10) / 10).toFixed(1);
			temp = Math.max($('#' + uid).attr('min_temp'), temp);
		}  
        deviceHmTc_setDelayed(uid, item, temp);
    }
});

$(document).delegate('div[data-widget="device.hmtc"] > div > a[data-icon="plus"]', {
    'click': function (event, response) {
        var uid = $(this).parent().parent().attr('id');
        var step = $('#' + uid).attr('data-step');
        var item = $('#' + uid + 'set').attr('data-item');
		var val = widget.get(item);
		
		var temp = 17.0;
		if ($.isNumeric(val)) {
			temp = (Math.round((widget.get(item) * 1 + step * 1) * 10) / 10).toFixed(1);
			temp = Math.min($('#' + uid).attr('max_temp'), temp);
		}
        deviceHmTc_setDelayed(uid, item, temp);
    }
});


// ----- homematic.silder ---------------------------------------------------------
// The slider had to be handled in a more complex manner. A 'lock' is used
// to stop the change after a refresh. And a timer is used to fire the trigger
// only every 400ms if it was been moved. There should be no trigger on init.
$(document).delegate('input[data-widget="homematic.slider"]', {
	'update': function (event, response) {
		// DEBUG: console.log("[homematic.slider] update '" + this.id + "': " + response + " timer: " + $(this).attr('timer') + " lock: " + $(this).attr('lock'));   
		$(this).attr('lock', 1);
		$('#' + this.id).val(response).slider('refresh').attr('mem', $(this).val());

		//delete class: lets assume this update was triggered by server ACK
		$(this).parent().find("div.ui-slider-bg").removeClass("basic_extra_slider_value_pending");
	},

	'slidestop': function (event) {
		if ($(this).val() != $(this).attr('mem')) {
			io.write($(this).attr('data-item'), $(this).val());
		}
	},

	'change': function (event) {
		// DEBUG: console.log("[homematic.slider] change '" + this.id + "': " + $(this).val() + " timer: " + $(this).attr('timer') + " lock: " + $(this).attr('lock'));   
		if (( $(this).attr('timer') === undefined || $(this).attr('timer') == 0 && $(this).attr('lock') == 0 )
			&& ($(this).val() != $(this).attr('mem'))) {

			if ($(this).attr('timer') !== undefined) {
				$(this).trigger('click');
			}

			$(this).attr('timer', 1);
			setTimeout("$('#" + this.id + "').attr('timer', 0);", 400);
		}

		$(this).attr('lock', 0);
	},

	'click': function (event) {
		// $('#' + this.id).attr('mem', $(this).val());		
		io.write($(this).attr('data-item'), $(this).val());
		
		//add a css class to alter appearance until ACK arrives
		$(this).parent().find("div.ui-slider-bg").addClass("basic_extra_slider_value_pending");
	}
});