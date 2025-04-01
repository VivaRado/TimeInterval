// vivarado / timeinterval / interface ∞ 2.9.8
import { formatDate, parseDate, assertDateUniform, _mths, _days } from "./dfp.js";
import { createEl, classOps, displayAlert, allowedIntegerInput } from "./utils.js";
import { assertDate, assertRange } from "./assertions.js";
class TimeInterval {
	constructor(trg, cfg) {
		var self = this;
		self.namespace = "TimeInterval";
		self._elm = [];
		self.tpis = [];
		self.tpwp = [];
		self.ctpi = [];
		self._def = {
			_elem           : "",
			reset           : false,
			upstream_input  : true,
			keyboard_arrow  : true,
			range           : true,
			labels          : false,
			aware_label     : false,
			start_time      : false,
			ast_silent      : false,
			ast_intvl       : true,
			ast_value       : true,
			labels_days		: _days,
			labels_mths		: _mths,
		};
		null==cfg&&(cfg={}),self.prm={...self._def,...cfg};
		self.prm.tokenSets = {
			"ye_tx": [true, 4, 9999, 100],
			"mo_tx": [true, 2, 12],
			"da_tx": [true, 2, null],
			"ho_tx": [true, 2, 24],
			"mn_tx": [true, 2, 60],
			"se_tx": [true, 2, 60],
			"ml_tx": [true, 2, 100],
			"me_tx": [false, 2, null]
		}
		self.prm.cl_actinp = "act_tinp";
		self.prm.cl_acwinp = "act_winp";
		self.prm.cl_tgbl   = "trigerable";
		self.prm.cl_rgsgl  = "range_single";
		self.prm.cl_rgdbl  = "range_double";
		self.prm.cl_labels = "labeled";
		self.prm.holdStarts = null;
		self.prm.timeoutId = 0;
		self.prm.holdDelay = 400;
		self.prm.holdActive = false;
		// Available Date Specifications
		self.specs = {
			'f_24H': {
				cls: "hour_minute",
				tkn: ["hour", "minute"],
				set: ["ho_tx", "mn_tx"],
				spc: 'HH:mm',
				mnd: "minute"
			},
			'f_12H': {
				cls: "hour_minute_meridiem",
				tkn: ["hour", "minute", "meridiem"],
				set: ["ho_tx", "mn_tx", "me_tx"],
				spc: 'hh:mm a',
				mnd: "minute"
			},
			'f_MY': {
				cls: "month_year",
				tkn: ["month", "year"],
				set: ["mo_tx", "ye_tx"],
				spc: 'MM/yyyy',
				mnd: "days"
			},
			'f_DMY': {
				tkn: ["day", "month", "year"],
				set: ["da_tx", "mo_tx", "ye_tx"],
				spc: 'dd/MM/yyyy',
				cls: "day_month_year",
				mnd: "days"
			},
			'f_DM': {
				cls: "day_month",
				tkn: ["day", "month"],
				set: ["da_tx", "mo_tx"],
				spc: 'dd/MM',
				mnd: "days"
			},
			'f_12H_sans_meridiem': {
				cls: null,
				tkn: [],
				set: [],
				spc: 'hh:mm',
				mnd: null
			}
		};
		self.prm.activeSpec = Object.values(self.specs).filter(item => item.spc === self.prm.format)[0];
		self.prm.activeTokens = self.prm.activeSpec.set.map(s => s.split('_tx')[0]);
		if ((trg instanceof NodeList) || (trg instanceof HTMLCollection) || Array.isArray(trg) ) {
			for (var i = 0; i < trg.length; i++) {
				self.build(trg[i], i);
				self.interact(trg[i]);
				self._elm.push(trg[i]);
			}
		} else {
			self.build(trg);
			self.interact(trg);
			self._elm.push(trg);
		}
		var se = self._elm[0];
		var inptnav = se[self.namespace].nav;
		if (self.prm.range == true) {
			inptnav.classList.add(self.prm.cl_tgbl)
			inptnav.classList.add(self.prm.cl_rgsgl)
			var btg = createEl("div",  { "class" : `btn range_toggle`, "data-range-selected": "single"} );
			inptnav.appendChild(btg);
		}
		if (self.prm.ast_intvl || self.prm.ast_value) {
			var alr = createEl("div",  { "class" : "alert inline-alert hide"} );
			inptnav.appendChild(alr);
		}
		if (self.prm.range == true) {
			se.parentNode.parentNode.querySelector(".range_toggle").addEventListener("click",function(e){
				var rt = e.target;
				var tgbl = rt.closest(`.${self.prm.cl_tgbl}`);
				var dtrs = "rangeSelected";
				se.classList.add("pause_transitions"); 
				window.setTimeout(function(){ 
					se.classList.remove("pause_transitions") 
				},500);
				tgbl.classList.toggle(self.prm.cl_rgsgl);
				tgbl.classList.toggle(self.prm.cl_rgdbl);
				rt.dataset[dtrs] = rt.dataset[dtrs] == "double" ? "single" : "double";
			});
		}
		document.addEventListener('click', function(e){
			if (document.querySelectorAll(`.${self.prm.cl_actinp}`).length > 0) {
				var crit_a = e.target.classList.contains(self.prm.cl_actinp);
				var crit_b = e.target.closest(`.${self.prm.cl_actinp}`);
				if ( !(crit_a || crit_b) ) {
					self.controlsHide(e.target);
					self.clearClass(self.prm.cl_actinp);
				}
			}
		});
		self.clearClass(self.prm.cl_actinp);
		self.alertBox = self.nav.querySelector(".alert");
	}
	build(element, inx = 0) {
		var self = this;
		self.nav = element.parentNode;
		self[self.namespace] = element[self.namespace] = {
			nav: element.parentNode,
			setDate: (data, eq) => { self.startTimeInterval( self._elm[eq], data, "direct" ) }
		};
		var cl_label = self.prm.labels?self.prm.cl_labels:''
		var cl_intax = (!self.prm.upstream_input && !self.prm.keyboard_arrow)?'no_pointer':'';
		var tkns     = self.prm.activeSpec.tkn;
		var tpw      = createEl('div', { 'class' : `wrap` });
		var etip     = createEl('div', { 'class' : `time_intvl ${self.prm.activeSpec.cls}`, 'data-id': inx, 'style': `--tkn_len:${ tkns.length }`});
		element.parentNode.insertBefore(etip, element);
		etip.appendChild(element);
		var atp = [];
		for (var t = 0; t < tkns.length; t++) {
			var isint = self.prm.tokenSets[self.prm.activeSpec.set[t]][0];
			var cl_types = `is${isint?'int':'str'}`;
			var tpe = createEl('div',  { 'class'   : `time_input ${cl_label}`, 
										 'data-tkn': tkns[t] 
									   });
			var tpi = createEl('input',{ 'class'   : `timeinterval-input inp cl_vert ${cl_types} ${cl_intax}`,
										 'data-tx' : self.prm.activeSpec.set[t],
										 'type'    : `${isint?'number':'text'}`
									   });
			tpe.appendChild(createEl('div', { 'class' : 'next action-next btn cl_bt' }));
			tpe.appendChild(tpi);
			tpe.appendChild(createEl('div', { 'class' : 'prev action-prev btn cl_tp' }));
			tpw.appendChild(tpe);
			atp.push(tpi)
		}
		self.tpis.push(atp);
		self.tpwp.push(tpw);
		tpw.appendChild(tpe);
		etip.appendChild(tpw);
		if (self.prm.range) {
			element[self.namespace].nav.classList.add(self.prm.cl_tgbl)
			element[self.namespace].nav.classList.add(self.prm.cl_rgsgl)
		}
		etip.classList.remove(self.prm.cl_actinp);
		if (self.prm.start_time) {
			self.prm.start_time = null;
			self.startTimeInterval( element, null, "downstream" );
		}
	}
	getControlInput(tgt){ this.ctpi = this.tpis[this.active_index].filter(item => item.dataset.tx === tgt.parentNode.querySelector(".timeinterval-input").dataset["tx"])[0];}
	clearClass(cls){ classOps(document.querySelectorAll(`.${cls}`), cls, null) }
	calendarDays(){ return new Date(this.prm.dto.ye, this.prm.dto.mo, 0).getDate() }
	isSubseq(el_inp){ return parseInt(el_inp.parentNode.dataset["id"]) == 1 ? true : false; }
	controlsShow(element) {
		var self = this;
		self.clearClass(self.prm.cl_actinp)
		element.parentNode.classList.add(self.prm.cl_actinp);
		self.prm.onshow && self.prm.onshow();
	}
	controlsHide(element) {
		var self = this;
		element.parentNode.classList && element.parentNode.classList.remove(self.prm.cl_actinp);
		self.prm.onhide && self.prm.onhide();
	}
	padValue(sym, val){
		var self = this;
		var stx = self.prm.tokenSets[`${sym}_tx`];
		return stx[0] ? String(val).padStart(stx[1], "0") : val;
	}
	determineValue( tx ) {
		var self = this;
		var sym = tx.split('_')[0];
		var val = self.prm.dto[sym].toString();
		return self.padValue(sym, val)
	}
	dateContract( frm ) {
		var self = this;
		var add_meridiem = "";
		var mer = self.prm.dto.me;
		if (frm == self.specs.f_12H.spc) {
			frm = self.specs.f_12H_sans_meridiem.spc;
			add_meridiem = ` ${mer}`;
		}
		var date = new Date( 
			self.prm.dto.ye, 
			self.prm.dto.mo - 1,
			self.prm.dto.da,
			self.prm.dto.ho,
			self.prm.dto.mn,
			self.prm.dto.se, 
			self.prm.dto.ml);
		self.prm.dto.ds = formatDate(frm, date) + add_meridiem;
		if ( self.prm.activeTokens.indexOf('mo') != -1) {
			self.prm.dto.nm = self.prm.labels_mths[ self.prm.dto.mo - 1];
		}
		if ( self.prm.activeTokens.indexOf('da') != -1) {
			self.prm.dto.nd = self.prm.labels_days[ parseDate(self.prm.dto.ds, self.prm.format).getDay() ];
		}
		self.prm.aware_label && self.awareLabelUpdate(self.ctpi.parentNode);
	}
	dateExpand( date_string, dir ) {
		var self = this;
		var ps_fdo = parseDate(date_string, self.prm.format, true);
		if (self.prm.format == self.specs.f_MY.spc) {
			ps_fdo.d = 1;
		}
		self.prm.dto = {
			ye : ps_fdo.y,
			mo : ps_fdo.M + 1,
			da : ps_fdo.d,
			ho : ( ps_fdo.a != '' ? ps_fdo.H % 12 || 12 : ps_fdo.H ),
			mn : ps_fdo.m,
			se : ps_fdo.s,
			ml : ps_fdo.S,
			me : ( ps_fdo.a != '' ? ( ps_fdo.a.startsWith("A") ? "AM" : "PM" ) : "" ),
			ds : date_string
		}
	}
	calcDate(dir){
		var self = this;
		var calc;
		var symb = self.ctpi.dataset.tx.split('_')[0];
		var dtsy = self.prm.dto[symb];
		var dirb = dir == "next" ? true : false;
		var indc = dirb ? +1 : -1;
		var _clc_ = function (val, hi, lo) {
			if (hi == val && dirb == true) {
				calc = lo;
			} else if (lo == val && dirb == false) {
				calc = hi;
			} else {
				calc = dtsy + indc;
			}
			return calc;
		};
		if (dir == "next" || dir == "prev") {
			if (symb == "da") {
				calc = _clc_(dtsy, self.calendarDays(), 1);
			} else if (symb == "mo") {
				calc = _clc_(dtsy, 12, 1);
			} else if (symb == "ho") {
				if ( ["AM", "PM"].indexOf(self.prm.dto.me) != -1 ) {
					calc = _clc_(dtsy, 12, 1);
				} else {
					calc = _clc_(dtsy, 23, 0);
				}
			} else if (symb == "mn") {
				calc = _clc_(dtsy, 59, 0);
			} else if (symb == "me") {
				calc = dtsy == "AM" ? "PM" : "AM";
			} else {
				calc = dtsy + indc;
			}
		} else {
			calc = dtsy;
		}
		self.prm.dto[symb] = calc;
	}
	populateWrapperInputs() {
		var self = this;
		var set = self.prm.activeSpec.set;
		for (var s = 0; s < set.length; s++) {
			self.tpwp[ self.active_index ].querySelector(`input[data-tx="${set[s]}"]`).value = self.determineValue( set[s] );
		}
	}
	dateDisplay() {
		var self = this;
		var el_inp = self.nav.querySelector(`.${self.prm.cl_actinp} input`);
		el_inp.value = self.prm.dto.ds;
		self.populateWrapperInputs();
	};
	assertDateTokens(){
		var self = this;
		var asts_date = [];
		var asts_msgs = [];
		var pset = self.prm.activeTokens;
		for (let sym in self.prm.dto) {
			var value = self.prm.dto[sym];
			if (pset.indexOf(sym) != -1 && sym != 'me') {
				var ast = assertDate( self, String(value), sym );
				asts_date.push(ast.verdict)
				for (var e = 0; e < ast.messages.length; e++) {
					asts_msgs.push(ast.messages[e])
				}
			} else {
				continue
			}
		}
		return {verdict:asts_date.every(val => val === true), messages: asts_msgs }
	}
	resolveDate(start_time, target, stream, direction) {
		var self = this;
		var messages = [];
		var timep = target.closest(".time_intvl").querySelector("input");
		var dtstr = start_time ? start_time : timep.value.length == 0 ? formatDate(self.prm.format, new Date()) : timep.value; // A1.
		if(!assertDateUniform(dtstr, self.prm.format)){ // A2.
			timep.value = self.prev_val;
			self.alertBox && messages.push('error_invalid_date');
		} else {
			self.dateExpand( dtstr, direction ); // A3.
			self.calcDate( direction ); // A4.
			var ast_dtkns = self.assertDateTokens(); // A5.
			var ast_range = {verdict: true, messages: []};
			if ( ast_dtkns.verdict ) {
				self.prev_val = timep.value; // A6.
				self.dateContract( self.prm.format ); // A7.
				var range_btn = self.nav.querySelector('[data-range-selected]');
				if ( range_btn && self.prm.range && range_btn.dataset.rangeSelected == 'double') { // A8.
					ast_range = assertRange( self, self.nav, self.isSubseq(timep) )
				}
				self.dateDisplay(); // A9.
			} else {
				timep.value = self.prev_val;
			}
			messages = [...ast_dtkns.messages, ...ast_range.messages];
		}
		(self.alertBox && !self.prm.ast_silent) && displayAlert( Array.from(new Set(messages)), self.alertBox ) // A10.
	}
	startTimeInterval( e, date_string, stream ) {
		var self = this;
		var tgt = e.target === undefined ? e : e.target;
		var ctp = tgt.closest('.time_intvl');
		if (ctp) {
			ctp.classList.add(self.prm.cl_actinp);
			self.active_index = ctp.dataset['id'];
			self.getControlInput(tgt);
		}
		var t_next = tgt.classList.contains("action-next");
		var t_prev = tgt.classList.contains("action-prev");
		var dct = t_prev ? "prev" : t_next ? "next" : "none";
		var dat = ( ( t_next || t_prev ) && self.prm.start_time) ? self.prm.start_time : date_string;
		self.resolveDate(dat, tgt, stream, dct);
	}
	arrowSelect( e, dir ) {
		var self = this;
		var targ = e.target.closest(".time_input");
		var sp = targ.previousSibling && targ.previousSibling.querySelector("input");
		var sn = targ.nextSibling && targ.nextSibling.querySelector("input");
		var tinp = dir == "left" ? sp : dir == "right" ? sn : undefined;
		tinp && setTimeout( () => tinp.select(),10);
	}
	onHold = ( self, e ) => {
		self.prm.holdStarts = setTimeout( () => {
			self.prm.holdStarts = null;
			self.prm.holdActive = true;
			self.prm.timeoutId = setInterval( () => self.startTimeInterval( e, null, "downstream" ), 50);
		}, self.prm.holdDelay);
	}
	onRelease = ( self, e ) => {
		if (self.prm.holdStarts) {
			clearTimeout(self.prm.holdStarts);
			self.startTimeInterval( e, null, "downstream" );
		} else if (self.prm.holdActive) {
			self.prm.holdActive = false;
		}
		clearTimeout(self.prm.timeoutId);
	}
	awareLabelUpdate(tgt){
		var self = this;
		if (self.prm.dto) {
			var tpis = self.tpis[ self.active_index ];
			for (var t = 0; t < tpis.length; t++) {
				var sym = tpis[t].dataset['tx'].split('_tx')[0];
				if (sym == 'mo') {
					tpis[t].parentNode.dataset['awl'] = self.prm.dto['nm'];
				} else if (sym == 'da') {
					tpis[t].parentNode.dataset['awl'] = self.prm.dto['nd'];
				}
			}
		}
	}
	wrapperInput(tgt, sym){
		var self = this;
		var pval = self.prm.dto[sym];
		self.prm.dto[sym] = parseInt(tgt.value);
		self.dateContract(self.prm.format);
		var ast_rg = {verdict: true, messages: []};
		var range_btn = self.nav.querySelector('[data-range-selected]');
		if ( range_btn && self.prm.range && range_btn.dataset.rangeSelected == 'double') { // A8.
			ast_rg = assertRange( self, self.nav, self.isSubseq(tgt) )
		}
		var ast_dt = assertDate( self, tgt.value, sym )
		if (tgt.value.length != 0 && ast_dt.verdict == true) {
			self.dateDisplay();
			self.prev_val = self.prm.dto[sym]
			tgt.value = self.padValue(sym, self.prev_val)
		} else {
			self.prm.dto[sym] = pval;
			tgt.value = self.padValue(sym, pval);
		}
		if (self.alertBox && !self.prm.ast_silent) {
			displayAlert( [...ast_dt.messages, ...ast_rg.messages], self.alertBox )
		}
	}
	interact( elem ) { 
		var self = this;
		var eti = elem.closest(".time_intvl");
		self.active_index = eti.dataset['id'];
		var wrap_cntrl = self.tpwp[ self.active_index ];
		var main_input = eti.querySelector("input");
		var wrap_input = wrap_cntrl.querySelectorAll("input");
		// B1.
		elem.addEventListener('click', (e) => self.controlsShow(elem) );
		elem.addEventListener('focus', (e) => self.controlsShow(elem) );
		// B2.
		wrap_cntrl.querySelectorAll('.action-next, .action-prev').forEach(function(elm){
			elm.addEventListener("contextmenu", (e) => e.preventDefault() ); // B3.
			elm.addEventListener("mousedown", (e) => (e.which == 1) && self.onHold(self, e) ); // B4.
			elm.addEventListener("mouseup", (e) => self.onRelease(self, e) ); // B5.
			elm.addEventListener("mouseleave", function(e){ // B6.
				if (self.prm.holdActive) {
					self.prm.holdActive = false;
					setTimeout(()=>clearTimeout(self.prm.timeoutId),10);
				}
			});
		});
		main_input.addEventListener('focusin', function(e){
			self.startTimeInterval( e, null, "downstream" ); // B7.
			self.prev_val = e.target.value; // B8.
		});
		main_input.addEventListener('keyup', function(e){
			if (e.keyCode == 8 || e.keyCode == 46) { return } // B9.
			if (e.keyCode == 13) { 
				self.startTimeInterval( e, null, "downstream" ); // B10.
			}
			if (e.key == "Escape") {
				self.controlsHide(wrap_cntrl, elem); // B11.
			}
		});
		wrap_input.forEach(function(elm){
			var sym = elm.dataset.tx.split('_tx')[0];
			elm.addEventListener('change',function(e){ // B12.
				if (self.prm.upstream_input == true) {
					if (e.target.classList.contains('isint')) {
						self.wrapperInput(e.target, sym)
					} else {
						e.target.value = self.prm.dto[sym]
					}
				}
			});
			elm.addEventListener('focusin',function(e){ // B13.
				self.clearClass(self.prm.cl_acwinp);
				e.target.classList.add(self.prm.cl_acwinp);
			});
			elm.addEventListener('keydown',function(e){ 
				if (self.prm.upstream_input == false || e.target.classList.contains('isstr')) {
					e.target.value = self.padValue( sym, self.prm.dto[sym] );
					e.preventDefault();
				}
				(e.target.classList.contains('isint') && allowedIntegerInput(e, [13, 8, 9, 37, 39])) && e.preventDefault(); // B14.
				if (self.prm.keyboard_arrow == true) { 	// B15.
					var targ_arrow_up = e.target
						.closest(".time_input")
						.querySelector(".action-next");
					var targ_arrow_down = e.target
						.closest(".time_input")
						.querySelector(".action-prev");
					if (e.which === 38) {
						e.preventDefault()
						self.startTimeInterval( targ_arrow_up, null, "upstream" );
					} else if (e.which === 40) {
						e.preventDefault()
						self.startTimeInterval( targ_arrow_down, null, "upstream" );
					} else if (e.which === 37) {
						self.arrowSelect(e, "left");
					} else if (e.which === 39) {
						self.arrowSelect(e, "right");
					}
				}
			});
			elm.addEventListener("blur", function (e) {
				self.clearClass(self.prm.cl_acwinp);
				setTimeout( () => clearTimeout(self.prm.timeoutId), 10);
			});
		})
	}
}
window['TimeInterval'] = TimeInterval;
export { TimeInterval }