$(document).delegate('a[data-widget="basic_extra.multistate"]', {
    'update': function (event, response) {
        for(i=1; i < Number.MAX_VALUE; i++) {
            attrName = 'data-val-' + i;
            attrVal = $(this).attr(attrName);
            if ($(this).attr(attrName) == undefined) {
                break;
            }
            if (response == attrVal) {
                $('#' + this.id + ' img').attr('src', $(this).attr('data-pic-' + i));
                break;
            }
        }
    }
});

$(document).delegate('select[data-widget="basic_extra.flip"]', {
	'update': function (event, response) {
		$(this).val($(this).attr('data-value-on') == response ? 'on' : 'off').slider('refresh');
	},

	'change': function (event) {
		io.write($(this).attr('data-item'), ($(this).val() == 'on' ? $(this).attr('data-value-on') : $(this).attr('data-value-off')));
	}
});

$(document).delegate('[data-widget="basic_extra.float"]', {
	'update': function (event, response) {
		val = parseFloat(response);
		if (!isNaN(val)) {
			if ($(this).attr('data-unit') != '') {
				$('#' + this.id).html(parseFloat(response).transUnit($(this).attr('data-unit')));
			}
			else {
				$('#' + this.id).html(parseFloat(response).transFloat());
			}
		}
		else {
			$('#' + this.id).html(response);
		}
	}
});