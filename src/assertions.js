// vivarado / timeinterval / assertions ∞ 1.0.2
import { formatDate, parseDate, _mths } from "./dfp.js";
function assertRange( timeinterval, cnav, subseq ) {
	var self = timeinterval;
	var result = [];
	var validation;
	var d_init_v;
	var d_subs_v;
	var alert_box = cnav.querySelector(".alert");
	if (self.prm.ast_intvl == true) {
		var _times = cnav.querySelector(`.${self.prm.activeSpec.cls} > input`);
		if (subseq) {
			d_init_v = self._elm[0].value;
			d_subs_v = self.prm.dto.ds;
		} else {
			d_init_v = self.prm.dto.ds;
			d_subs_v = self._elm[1].value;
		}
		if (d_init_v != '' && d_subs_v != '') {
			var d_init   = parseDate(d_init_v, self.prm.format).getTime();
			var d_subs   = parseDate(d_subs_v, self.prm.format).getTime();
			if ( d_init >= d_subs ) {
				result.push("error_subsequent_time_can_not_be_smaller_or_equal_to_initial_time");
				validation = false;
			} else {
				validation = true;
			}
		}
	} else {
		validation = true;
	}
	return { verdict: validation, messages: result}
}
function assertDate( timeinterval, date_str, sym ) {
	var self = timeinterval;
	var result = [];
	var validation = true;
	var vml;
	var alert_box =  self.nav.querySelector(".alert");
	var set       = self.prm.tokenSets[`${sym}_tx`];
	var min_ye    = sym == 'ye' ? set[3] : 0;
	var pdt       = parseDate(date_str, self.prm.format); // C1.
	var pdv       = self.padValue(sym, date_str);
	var sym_nam   = self.prm.activeSpec.tkn[self.prm.activeSpec.set.indexOf(`${sym}_tx`)];
	if (!self.prm.ast_value) return { verdict: validation, messages: result};
	if ( sym == 'da') {
		vml = self.calendarDays();
	} else if (sym == 'ho') {
		if (self.prm.dto.me != '') {
			vml = set[2] / 2;
		} else {
			vml = set[2];	
		}
	} else {
		vml = set[2];
	}
	var ast_invalid    = (pdt == 'Invalid Date');
	var ast_digit_len  = (pdv.length > set[1]); // C2.
	var ast_unit_len   = pdv > vml;
	var ast_min_year   = (sym == 'ye' && pdv < min_ye);
	var ast_max_ovrflw = (sym == 'ho' && self.prm.dto.me == '' && pdv >= 24) || (sym == 'mn' && pdv >= 60); // C4.
	if (ast_invalid ) {
		result.push(`error_invalid_date`)
		validation = false;
	}
	if (ast_digit_len ) {
		result.push(`error_digit_length_is_${pdv.length}_but_max_for_${sym_nam}_is_${set[1]}`)
		validation = false;
	} else {
		var alrt_txt;
		if (ast_unit_len ) {
			if (sym == 'da') {
				alrt_txt = `error_unit_length_is_${pdv}_but_max_for_(${_mths[self.prm.dto.mo-1]}/${self.prm.dto.ye})_is_${vml}_days`
			} else {
				alrt_txt = `error_unit_length_is_${pdv}_but_max_for_${sym_nam}_is_${vml}`
			}
			result.push(alrt_txt)
			validation = false;
		}
	}
	if (ast_min_year ) { // C3.
		result.push(`error_min_for_${sym_nam}_is_${min_ye}`)
		validation = false;
	}
	if(ast_max_ovrflw){
		validation = false;
	}
	return { verdict: validation, messages: result}
};
export {assertRange, assertDate}