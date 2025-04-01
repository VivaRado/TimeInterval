/*  vivarado / timeinterval / dateformatparse ∞ 1.3.2
	"h:mm a"                       // 8:46 PM
	"MM/dd/yyyy"                   // 02/17/2020
	"MMM dd, yyyy"                 // Feb 17, 2020
	"EEE, MMM d, ''yy"             // Mon, Feb 17, '20
	"hh 'o''clock' a, X"           // 08 o'clock PM, -0600
	"yyyyMMdd'T'HHmmssXX"          // 20200217T204746-0600
	"yyyy-MM-dd'T'HH:mm:ssXXXX"    // 2020-02-17T20:47:46-06:00
	"hh 'o''clock' a, zzzz"        // 12 o'clock PM, Pacific Daylight Time
	"O"        // GMT-8
	"OOOO"     // GMT-08:00 
	"x"        // -08 		// +00 if offset is zero
	"xx"       // -0800 	// <<
	"xxx"      // -08:00 	// <<
	"xxxx"     // -0800 	// <<
	"xxxxx"    // -08:00 	// <<
	"X"        // -08 		// "Z" if offset is zero
	"XX"       // -0800 	// <<
	"XXX"      // -08:00 	// <<
	"XXXX"     // -0800 	// <<
	"XXXXX"    // -08:00 	// <<
	"zzzz"     // Pacific Standard Time
	
	formatDate( "MMM dd, yyyy", new Date()   ) // returns string
	parseDate ( "05/12/2450"  , "MM/dd/yyyy" ) // returns date object
*/
const _TZ = (date, symb) => {
	const chunk = [];
	const offset = -date.getTimezoneOffset();
	var clh = pads(Math.floor(offset / 60), 2);
	var clm = pads(offset % 60, 2);
	var sfs = (offset > 0 ? "+" : "-");
	if ( symb.toUpperCase().indexOf("X") != -1 ) {
		chunk.push( ( offset === 0 && symb == 'X') ? "Z" : sfs);
		if (offset != 0) { chunk.push(clh);
			if ( [2,4].includes(symb.length) ) { chunk.push(clm);
			} else if ( [3,5].includes(symb.length) ) {
				chunk.push(":");
				chunk.push(clm);
			}
		}
	} else if ( ["z","O"].some(f=> symb.includes(f)) ){
		var tz_s = new Date().toLocaleTimeString('en',{ timeZoneName:'short'}).split(' ')[2];
		var tz_abbr = tz_s.replace(/[^a-z]/gi, '');
		var tznaml = new Intl.DateTimeFormat('en', { timeZoneName: 'long'}).formatToParts(date).find(x => x.type ==='timeZoneName').value;
		if ( symb.indexOf("z") != -1 ) { chunk.push(tznaml)
		} else if ( symb.indexOf("O") != -1 ) {
			if (symb.length == 1) { chunk.push(tz_s)
			} else if (symb.length == 4){
				chunk.push(tz_abbr)
				chunk.push(sfs);
				chunk.push(clh);
				chunk.push(":");
				chunk.push(clm);
			}
		}
	}
	return chunk.join("");
};
const _h = (date, symb) => ( date % 12 || 12 );
const _a = (date, symb) => ( date >= 12 ? "PM" : "AM");
const _M = (date, symb) => (symb == 3) ? _mths[ date ] : (symb == 2 || symb == 1) ? String( date  + 1 ) : date;
const _E = (date, symb) => _days[ date ];
var noparse = /(?<!')(?!')/;
var _days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var _mths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
var keywords = {
	y: { p: true, rgl:[[2,4]], t:'date', f:'getFullYear'},
	M: { p: true, rgl:[[3],[1,2]], t:'date', f:'getMonth', sbs: _M},
	d: { p: true, rgl:[[1,2]], t:'date', f:'getDate'},
	H: { p: true, rgl:[[1,2]], t:'date', f:'getHours'},
	h: { p: true, rgl:[[1,2]], t:'date', f:'getHours', sbs: _h},
	a: { p: true, rgl:[[1,2]], t:'date', f:'getHours', sbs: _a},
	m: { p: true, rgl:[[1,2]], t:'date', f:'getMinutes'},
	s: { p: true, rgl:[[1,2]], t:'date', f:'getSeconds'},
	S: { p: true, rgl:[[3]], t:'date', f:'getMilliseconds'},
	E: { rgl:[[1,3]], t:'date', f:'getDay',   sbs: _E},
	z: { rgl:[[4]], t:'tizo', f: _TZ },
	x: { rgl:[[1,5]], t:'tizo', f: _TZ },
	X: { rgl:[[1,5]], t:'tizo', f: _TZ },
	O: { rgl:[[1,4]], t:'tizo', f: _TZ },
};
var rg_f = [];
var rg_p = [];
for (const key in keywords) {
	var k = keywords[key];
	var rstr = '';
	for (var i = 0; i < k.rgl.length; i++) {
		var regstr = `${key}{${k.rgl[i]}}`;
		rg_f.push( regstr );
		k.p && rg_p.push( regstr );
	}
}
var rgf = new RegExp(`(${rg_f.join('|')})${noparse.source}`, "g")
var rgp = new RegExp(`(${rg_p.join('|')})`, "g")
function replaceCoverage(fStr, iArr){
	var covrep = [];
	var fs = String(fStr);
	for (const key in iArr) {
		var t = iArr[key];
		var splstr = fs.split(t.msp);
		fs = splstr[splstr.length - 1];
		covrep.push(splstr[0]);
		covrep.push(t.mtc);
	}
	return covrep.join( "" ).replaceAll("''", '"').replaceAll("'" , '').replaceAll('"' , "'");
}
const pads = (str, mt) => String(str).padStart(mt, "0");
function kfn(mtc, kwds, rk = false){
	var oks = Object.keys(kwds);
	var kwi = oks.findIndex( st => mtc.includes(st) );
	var kfn = null;
	var fk = null;
	if ( kwi != -1 ) { 
		fk = oks[kwi];
		kfn = kwds[fk];
	}
	if (rk) {
		return fk;
	} else {
		return kfn;
	}
}
function formatDate(fStr, dObj) {
	var iArr = [];
	if (!dObj) { dObj = new Date(); }
	var matches = fStr.match(rgf);
	for (var i = 0; i < matches.length; i++) {
		var res;
		var mtc = matches[i];
		var mtl = mtc.length;
		var kfnc = kfn(mtc, keywords);
		if (kfnc != null) {
			if (kfnc.t == 'date') {
				res = parseInt( Date.prototype[kfnc.f].call(dObj) );
				if (kfnc.sbs) res = kfnc.sbs(res, mtl);
				res = pads( res, mtl )
			}
			if (kfnc.t == 'tizo') res = kfnc.f(dObj, mtc);
			let obj = { msp: mtc, mtc: res };
			iArr.push(obj);
		}
	}
	return replaceCoverage( fStr, iArr );
}
function assertDateUniform(dStr, fStr){
	var matches = fStr.match(rgp);
	var lens = 0;
	var fnonnum = String(fStr);
	for (var i = 0; i < matches.length; i++) {
		fnonnum = fnonnum.replace( matches[i], '');
		var max_len = Math.max(...kfn(matches[i], keywords).rgl.flat());
		lens += max_len;
	}
	var fnns = fnonnum.split('');
	var dnonnum = String(dStr);
	for (var j = 0; j < fnns.length; j++) {
		dnonnum = dnonnum.replaceAll( fnns[j], '');
	}
	if (dnonnum.length > lens) {
		return false
	} else {
		return true
	}
}
function parseDate(dStr, fStr, obj) {
	var d = new Date();
	var dto = {
		y: d.getFullYear(),
		M: d.getMonth() + 1,
		d: d.getDate(),
		H: 0,
		h: 0,
		m: 0,
		s: 0,
		S: 0,
		a: "",
	};
	var matches = fStr.match(rgp);
	if (!assertDateUniform(dStr, fStr)) {
		return false
	} else {
		for (var i = 0; i < matches.length; i++) {
			var sub = matches[i];
			var res = dStr.substring(fStr.indexOf(sub), fStr.indexOf(sub) + sub.length);
			var tk = kfn(sub, dto, true);
			if (tk != null && res != '') {
				if (tk != 'a') (res = parseInt(res));
				dto[tk] = res;
			}
		}
		if (dto.a.startsWith('A')) (dto.H = dto.h)
		if (dto.a.startsWith('P')) (dto.H = dto.h + 12)
		dto.M -= 1;
		if (obj) {
			return dto
		} else {
			delete dto.h;
			delete dto.a;
			return new Date( ...Object.values(dto) );
		}
	}
}
function calcMonad(date, monad, quant) {
	var calc;
	if (monad == "days") {
		calc = quant;
	} else if ((monad = "minutes")) {
		calc = quant * 60000;
	}
	return new Date(date.getDate() + calc);
}
export { formatDate, parseDate, assertDateUniform, calcMonad, _mths, _days };