// Inputs
(function() {
	function Ctx(val) { this.par = null; this.val = val }
	function Keyd(key, val) { this.key = key; this.val = val }

	var OPERATORS = ['~', '+', '-', '*', '/', '%', '^', ':', '&', '|', '<', '=', '>', ''];
	OPERATORS.forEach(function(o) {
		Object.prototype[o] = function(y) {
			var m = o + (y === null ? 'Null' : y.constructor.name);
			return this[m] ? this[m](y) : Object.assign(new Error('Unknown operation ' + this.constructor.name + m), { x: this.valueOf(), 'o': o, y: y});
		};
		Object.prototype[o + 'Ctx'] = function(y) {
			y = y.val;
			while(y instanceof Function) y = y();
			return this[o](y)
		};
		Object.prototype[o + 'Function'] = function(y) {
			return this[o](y())
		};
		Object.prototype[o + 'Error'] = function(y) { return y };
		Ctx.prototype[o] = function(y) {
			var x = this.val;
			while(x instanceof Function) x = x();
			return x[o](y)
		};
		Function.prototype[o] = function(y) { return this()[o](y) };
		Error.prototype[o] = function() { return this }
	});

	Object.assign(Object.prototype, {
		'~String': function(y) { var m = '~' + y.toLowerCase(); return this[m] ? this[m]() : new Error('Unknown typer String' + m) }
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
		'~syntez': function() {
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
						(x = function fn() {
							if (fn.val === null) {
								fn.i = Syn.i;
								var r = fn['0o'];
								for (var i = 1, s = fn.sz; i < s; i++) {
									r = r[fn[i]](fn[i + 'o'])
								}
								fn.val = r
							}
							return fn.val
						}).val = null;
						x.par = r;
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
		':': function(y) {
			var name = this.toLowerCase();
			if (Syn.hasOwnProperty(name)) {
				var r = Syn[name](y);
				Object.assign(r, {
					'/': Object.prototype['/'],
					'/Null': function(y) { this.uri += '/'; return this },
					'/String': function(y) { this.uri += '/' + y; return this }
				});
				return r
			} else return new Error('Unknown source name ' + this)
		},
		'': function(y) {
			return new Keyd(this.valueOf(), y)
		}
	});

	Object.assign(Array.prototype, {
		'/String': function(y) { for (var i = 0, l = this.length; i < l; i++) if (this[i] instanceof Keyd && this[i].key === y) return this[i].val; return null }
	});

// View
	Object.assign(HTMLElement.prototype, {
		'=Null': function(y) {
			return this.textContent = ''
		},
		'=Number': function(y) {
			return this.textContent = y
		},
		'=String': function(y) {
			return this.textContent = y
		},
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
		'=Error': function(y) {
			return this.innerHTML = '<span style="color:#f00">' + y + '</span>'
		}
	});

// Console
	Object.assign(console, {
		'=Number': function(y) { console.log(y) },
		'=String': function(y) { console.log(y) },
		'=Array': function(y) { var result = []; console.log(y) },
		'=Null': function() { console.clear() },
		'=Error': function(y) { console.error(y) }
	});
})()