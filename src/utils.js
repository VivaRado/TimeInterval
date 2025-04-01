// vivarado / timeinterval / utils ∞ 1.0.1
function createEl(type, props) {
	var el = document.createElement(type);
	for (var prop in props) { el.setAttribute(prop, props[prop]) };
	return el;
}
function classOps(ndlst, rem_classes, add_classes, prefix = ''){
	var proc = function(el){
		var oper = function(op, arr) {
			if (Array.isArray(arr)) {
				if (arr) el.classList[op](...arr.map(i => prefix + i));
			} else {
				if (arr) el.classList[op]( prefix+arr);
			}
		}
		oper('add', add_classes);
		oper('remove', rem_classes);
	}
	if ((ndlst instanceof NodeList) || (ndlst instanceof HTMLCollection) || Array.isArray(ndlst) ) {
		Array.from(ndlst).filter( (el) => {
			proc(el);
		});
	} else {
		proc(ndlst);
	}
}
function displayAlert(alert_data, target_alert, animation){
	var anim_type;
	target_alert.innerHTML = '';
	var ul = target_alert.querySelector('ul');
	var processAlert = function(altex, tul){
		var altex = altex.toString();
		var alert_class = altex.substring(altex.indexOf('_'),0);
		var display_data = altex.substring(altex.indexOf('_')+1).toString().replace(/_/g,' ');
		var li = createEl("li", { class: alert_class });
		li.innerHTML = display_data;
		tul.append(li);
		classOps(target_alert, 'hide', 'active_alert');
	}
	if (alert_data != '' || alert_data.length > 0) {
		if( ul == null){
			ul = createEl("ul");
			target_alert.append(ul);
		}
		if (Array.isArray(alert_data)) {
			for (var i = 0; i < alert_data.length; i++) {
				processAlert(alert_data[i], ul);
			}
		} else {
			processAlert(alert_data, ul);
		}
		clearTimeout(anim_type);
		if (animation) {
			anim_type = setTimeout(function(){
				target_alert.classList.add('hide');
				target_alert.innerHTML = '';
				clearTimeout(anim_type);
			},3000);
		} else {
			clearTimeout(anim_type);
		}
	}
}
function allowedIntegerInput(e, ignore){
	var numpadn = (e.keyCode > 105 || e.keyCode < 96);           // numpad numbers
	var numbers = (e.keyCode < 48 || e.keyCode > 57);            // number keys 
	var nonchar = e.keyCode > 31;                                // not characters
	var ctrlmta = !(e.ctrlKey || e.metaKey);                     // ctrl or meta
	var ignored = ignore.indexOf(e.keyCode) == -1;   // ignored
	return (ctrlmta && numpadn && nonchar && numbers && ignored)
}
export { createEl, classOps, displayAlert, allowedIntegerInput }