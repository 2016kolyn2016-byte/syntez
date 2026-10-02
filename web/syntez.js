function Ctx(val) { this.par = null; this.val = val }
function Keyd(key, val) { this.key = key; this.val = val }

var OPERATORS = ['~', '+', '-', '*', '/', '%', '^', '#', ':', '.', '&', '|', '<', '=', '>', ''];
OPERATORS.forEach(function(o) {
	Number.prototype[o] = String.prototype[o] = Array.prototype[o] = Ctx.prototype[o] = function(y) {
		var m = o + (y instanceof Ctx ? 'Ctx' : y instanceof Array ? 'Array' : y instanceof Function ? 'Function' : typeof y === 'string' ? 'String' : typeof y === 'number' ? 'Number' : y instanceof Error ? 'Error' : y instanceof Keyd ? 'Keyd' : 'Null');
		return this[m] ? this[m](y) : new Error('Unknown operation ' + (this instanceof Ctx ? 'Ctx' : this instanceof Array ? 'Array' : this instanceof Function ? 'Function' : this instanceof String ? 'String' : this instanceof Number ? 'Number' : y instanceof Keyd ? 'Keyd' : this instanceof Error ? 'Error' : 'Null') + m);
	};
	Number.prototype[o + 'Ctx'] = String.prototype[o + 'Ctx'] = Array.prototype[o + 'Ctx'] = Ctx.prototype[o + 'Ctx'] = function(y) {
		return this[o](y.val)
	};
	Number.prototype[o + 'Function'] = String.prototype[o + 'Function'] = Array.prototype[o + 'Function'] = Ctx.prototype[o + 'Function'] = function(y) {
		return this[o](y())
	};
	Number.prototype[o + 'Error'] = String.prototype[o + 'Error'] = Array.prototype[o + 'Error'] = Error.prototype[o + 'Error'] = function(y) { return y };
	Ctx.prototype[o] = function(y) { return this.val[o](y) };
	Error.prototype[o] = function() { return this }
});

Object.assign(Number.prototype, {
	'+Number': function(y) { return this + y },
	'-Number': function(y) { return this - y },
	'*Number': function(y) { return this * y },
	'/Number': function(y) { return this / y },
	'%Number': function(y) { return this % y },
	'^Number': function(y) { return Math.pow(this, y) },
	':Number': function(y) { return Math.pow(this, 1 / y) }
});

Object.assign(String.prototype, {
	'~String': function(y) { var m = '~ ' + y; return this[m] ? this[m]() : new Error('Unknown typer String' + m) },
	'~ syntez': function() {
		for (var r = new Ctx(null), a = null, x = null, o = null, y = null, c = null, t = null, i = 0, l = this.length; i <= l; i++) {
			if ((c = this[i]) === undefined) {
				if (x === null) x = y; else { x[x.sz + 'o'] = y; x[x.sz++] = o }
				if (a !== null) {
					if (x !== null) a[a.length] = x;
					x = a
				}
				r.val = x;
				return r
			} else if (OPERATORS.includes(c)) {
				if (o === null) {
					x = function fn() {
						var r = fn['0o'];
						for (var i = 1, s = fn.sz; i < s; i++) {
							r = r[fn[i]](fn[i + 'o'])
						}
						return r
					};
					x.par = r;
					x.val = null;
					x.sz = 1;
					x['0o'] = y;
					y = null
				} else {
					x[x.sz + 'o'] = y;
					x[x.sz++] = o;
					y = null
				}
				o = c
			} else switch (c) {
				case' ':case'\t':case'\r':case'\n':break;
				case'"': { while ((++i) < l) if (this[i] === '"') break } break;
				case'(':case'{':case'[':
					t = (new Ctx({ a: a, x: x, o: o, y: y }));
					t.par = r;
					r = t;
					a = x = o = y = null;
					break;
				case';':
					if (a === null) {
						t = [];
						t.par = r;
						a = t
					}
					if (x === null) x = y; else { x[x.sz + 'o'] = y; x[x.sz++] = o }
					a[a.length] = x;
					x = y = o = null;
					break;
				case']':case'}':case')':
					if (x === null) x = y; else { x[x.sz + 'o'] = y; x[x.sz++] = o }
					if (a !== null) {
						if (x !== null) a[a.length] = x;
						x = a
					}
					t = x;
					a = r.val.a;
					x = r.val.x;
					o = r.val.o;
					y = r.val.y;
					r.val = t;
					y = y === null ? r : y[''](r);
					r = r.par;
					break;
				case'0':case'1':case'2':case'3':case'4':case'5':case'6':case'7':case'8':case'9':
					t = parseInt(c); while((++i) < l) { if ((c = this[i]) === ' '); else if(c >= '0' && c <= '9') { t *= 10; t += parseInt(c) } else break } i--;
					y = y === null ? t : y[''](t);
					break;
				case'\'':
					t = ''; while((++i) < l) { if ((c = this[i]) === '\'') { if (this[++i] !== '\'') { i--; break } } t += c } if (i === l) i--;
					y = y === null ? t : y[''](t);
					break;
				default:
					t = c; while ((++i) < l) { c = this[i]; if (OPERATORS.includes(c) || c === ' ' || c === '\t' || c === '\r' || c === '\n' || c ==='"' || c === '(' || c === '{' || c === '[' || c === ';' || c === ']' || c === '}' || c === ')' || c === '\'') break; t += c } i--; t = t.trim();
					y = y === null ? t : y[''](t);
					break
			}
		}
	},
	'+String': function(y) { return this + y },
	'': function(y) { return new Keyd(this.valueOf(), y) }
});

Object.assign(Array.prototype, {
	'/String': function(y) { for (var i = 0, l = this.length; i < l; i++) if (this[i] instanceof Keyd && this[i].key === y) return this[i].val; return null }
});

// Inputs
(function() {
	var wtr = null, ind = 0;
	function syn(value) {
		function syn(value) {
			if (arguments.length) {
				var val = syn.val;
				free(val);
				syn.val = value;
				var wtrs = syn.wtrs;
				for (var i = 0; i < wtrs.length; i++) {
					try { tez(wtrs[i]) } catch(e) { console.error(e) }
				}
				return val
			} else if (wtr) {
				if (syn.wtrs.indexOf(wtr) === -1) {
					syn.wtrs[syn.wtrs.length] = wtr;
					wtr.srcs[wtr.srcs.length] = syn
				}
				syn.ind = wtr.ind
			}
			return syn.val
		}
		syn.val = value;
		syn.wtrs = [];
		syn.ind = 0;
		syn.free = free;
		return syn
	}
	function tez(fn) {
		if (!fn.srcs) fn.srcs = [];
		fn.ind = ++ind;
		wtr = fn;
		try { fn() } catch(e) { console.error(e) } finally { wtr = null }
		for (var i = 0, j = 0; i < fn.srcs.length; i++) {
			var src = fn.srcs[i];
			if (src.ind === fn.ind) {
				fn.srcs[j++] = src
			} else {
				var idx = src.wtrs.indexOf(fn);
				if (idx !== -1) src.wtrs.splice(idx, 1)
			}
		}
		fn.srcs.length = j
	}
	function free(deleting) {
		var fn = this;
		if (!fn || !fn.srcs) return;

		for (var i = 0; i < fn.srcs.length; i++) {
			var wtrs = fn.srcs[i].wtrs;
			var idx = wtrs.indexOf(fn);
			if (idx !== -1) wtrs.splice(idx, 1)
		}
		fn.srcs.length = 0;

		if (deleting) {
			if (fn.wtrs) fn.wtrs.length = 0;
			fn.val = undefined;
			fn.ind = 0
		}
	}

	var p = {
		keys: function keys(y) {
			if (!keys.hasOwnProperty('syn')) {
				keys.syn = syn(keys.val = {});
		        window.onkeydown = window.onkeyup = window.onblur = function(e) {
					if (!e.ctrlKey) delete keys.val.Control;
					if (!e.shiftKey) delete keys.val.Shift;
					if (!e.altKey) delete keys.val.Alt;
					if (!e.metaKey) delete keys.val.Meta;
					if (e.type === 'keydown') keys.val[e.key] = e.code;
					else if (e.type === 'keyup') delete keys.val[e.key];
					else keys.val = {};
					keys.syn(keys.val)
				}
			}
			return keys.syn()
		},
		mouse: function mouse() {
			if (!mouse.syn) {
				mouse.syn = syn(mouse.val = {});
				window.onmousedown = function(e) {
					mouse.val.target = e.target;
					mouse.syn(mouse.val)
				};
				window.onmouseup = function(e) {
					delete mouse.val.target;
					mouse.syn(mouse.val)
				};
				window.onmousemove = function(e) {
					mouse.val.x = e.offsetX;
					mouse.val.y = e.offsetY;
					mouse.syn(mouse.val)
				}
			}
			return mouse.syn()
		},
		location: function location() {
			if (!location.val) {
				location.act = syn(location.val = window.location + '');
				window.onhashchange = function(e) { location.act(location.val = window.location + '') }
			}
			return location.act()
		}
// HTTP
// timer
// WebSocket
// file
// console
	};
	String.prototype[':'] = function(y) {
		if (p.hasOwnProperty(this)) return p[this](y);
		else return new Error('Unknown source name ' + this);
	};

// View
	Object.assign(HTMLElement.prototype, {
		'=': function(y) {
			var m = '=' + (y instanceof Ctx ? 'Ctx' : y instanceof Array ? 'Array' : y instanceof Function ? 'Function' : typeof y === 'string' ? 'String' : typeof y === 'number' ? 'Number' : y instanceof Keyd ? 'Keyd' : y instanceof Error ? 'Error' : 'Null');
			return this[m] ? this[m](y) : new Error('Unknown operation ' + 'HTMLElement' + m);
		},
		'=Ctx': function(y) { return this['='](y.val) },
		'=Function': function(y) { return this['='](y()) },
		'=Null': function(y) { return this.textContent = '' },
		'=Number': function(y) { return this.textContent = y },
		'=String': function(y) { return this.textContent = y },
		'=Array': function(y) {
			this.textContent = '';
			var t, v, r = document.createDocumentFragment();
			for (var i = 0 , l = y.length; i < l; i++) {
				t = y[i];
				v = t.val;
				if (v instanceof Ctx) v = v.val;
				if (t instanceof Keyd) switch(t.key) {
					case'a':
						this.style.boxShadow = v + 'px ' + v + 'px ' + v + 'px ' + v + 'px #000000';
						break;
					case'b':
						this.style.backgroundColor = '#' + v.toString(16).padStart(8, '0');
						break;
					case'c':
						this.style.color = '#' + v.toString(16).padStart(8, '0');
						break;
					case'f':
						this.style.fontFamily = v;
						break;
					case'g':
						var fract = v % 1, numb = v - fract;
						this.style.fontSize = numb + 'px';
						this.style.fontWeight = Math.round((fract || 1) * 100) * 10 - 100;
						break;
					case'p':
						this.style.padding = v + 'px';
						break;
					case'pt':
						this.style.paddingTop = v + 'px';
						break;
					case'pb':
						this.style.paddingBottom = v + 'px';
						break;
					case'pl':
						this.style.paddingLeft = v + 'px';
						break;
					case'pr':
						this.style.paddingRight = v + 'px';
						break;
					case's':
						this.style.textAlign = v === -1 ? 'left' : v === 1 ? 'right' : v === 0 ? 'center' : 'justify';
						break;
					case'w':
						console.error('Widget = ' + v);
						break;
					case'x':
						var fract = v % 1, numb = v - fract;
						if (numb) this.style.maxWidth = numb + 'px';
						this.style.width = (fract || 1) * 100 + '%'
						break;
					case'y':
						this.setAttribute('data-v', '');
						var fract = v % 1, numb = v - fract;
						if (numb) this.style.minHeight = numb + 'px';
						if (fract || !numb) this.style.height = (fract || 1) * 100 + '%'
						break;
					case'z':
						console.error('Z = ' + v);
						break;
				} else {
					if (r.childNodes.length) r.appendChild(document.createElement('s-g')).textContent = ' ';
					(r.appendChild(document.createElement('div')))['='](t)
				}
			}
			this.appendChild(r)
		},
		'=Error': function(y) { return this.innerHTML = '<span style="color:#f00">' + y + '</span>' }
	});

// Console
	console['='] = function(y) {
		while (y instanceof Ctx) y = y.val;
		while (y instanceof Function) y = y();
		if (y instanceof Error) console.error(y);
		else console.log(y)
	};

// Init
	var app = null;
	fetch('index.syntez').then(data => data.text()).then(data => {
		app = data['~']('syntez');
		tez(function() { document.body.innerHTML = '<div></div>'; document.body.firstChild['='](app['/']('view')) });
		tez(function() { console['='](app['/']('console')) })
	})
})()
