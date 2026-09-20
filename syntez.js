// Reactivity
var syn = (function() {
    var wtr = null, ind = 0;
    function free(deleting) {
        var fn = this;
        if (!fn || !fn.srcs) return;

        for (var i = 0; i < fn.srcs.length; i++) {
            var wtrs = fn.srcs[i].wtrs;
            var idx = wtrs.indexOf(fn);
            if (idx !== -1) wtrs.splice(idx, 1);
        }
        fn.srcs.length = 0;

        if (deleting) {
            if (fn.wtrs) fn.wtrs.length = 0;
            fn.val = undefined;
            fn.ind = 0;
        }
    }
    function tez(value) {
        function tez(value) {
            if (arguments.length) {
                var val = tez.val;
                tez.val = value;
                var wtrs = tez.wtrs.slice();
                for (var i = 0; i < wtrs.length; i++) {
                    try { syn.tez(wtrs[i]) } catch(e) { console.error(e) }
                }
                return val
            } else if (wtr) {
                if (tez.wtrs.indexOf(wtr) === -1) {
                    tez.wtrs[tez.wtrs.length] = wtr;
                    wtr.srcs[wtr.srcs.length] = tez;
                }
                tez.ind = wtr.ind
            }
            return tez.val
        }
        tez.val = value;
        tez.wtrs = [];
        tez.ind = 0;
        tez.free = free;
        return tez
    }
    syn = tez({});
    syn.tez = function() {
        if (arguments.length) {
            var arg = arguments[0];
            if (arg instanceof Function) {
                if (!arg.srcs) arg.srcs = [];
                arg.ind = ++ind;
                wtr = arg;
                try { arg() } catch(e) { console.error(e) } finally { wtr = null }

                for (var i = 0, j = 0; i < arg.srcs.length; i++) {
                    var src = arg.srcs[i];
                    if (src.ind === arg.ind) {
                        arg.srcs[j++] = src
                    } else {
                        var idx = src.wtrs.indexOf(arg);
                        if (idx !== -1) src.wtrs.splice(idx, 1)
                    }
                }
                arg.srcs.length = j;
            } else return tez(arg)
        } else return tez()
    };
    return syn
})();

// Inputs
syn.keys = function keys() {
    if (!keys.data) {
        keys.act = syn.tez(keys.data = {});
        window.onkeydown = window.onkeyup = window.onblur = function(e) {
            if (!e.ctrlKey) delete keys.data.Control;
            if (!e.shiftKey) delete keys.data.Shift;
            if (!e.altKey) delete keys.data.Alt;
            if (!e.metaKey) delete keys.data.Meta;
            if (e.type === 'keydown') keys.data[e.key] = e.code;
            else if (e.type === 'keyup') delete keys.data[e.key];
            else keys.data = {};
            keys.act(keys.data)
        }
    }
    return keys.act()
};
syn.mouse = function mouse() {
    if (!mouse.data) {
        mouse.act = syn.tez(mouse.data = {});
        window.onmousedown = function(e) {
            mouse.data.target = e.target;
            mouse.act(mouse.data)
        };
        window.onmouseup = function(e) {
            delete mouse.data.target;
            mouse.act(mouse.data)
        };
        window.onmousemove = function(e) {
            mouse.data.x = e.offsetX;
            mouse.data.y = e.offsetY;
            mouse.act(mouse.data)
        }
    }
    return mouse.act()
};
syn.location = function location() {
    if (!location.data) {
        location.act = syn.tez(location.data = window.location + '');
        window.onhashchange = function(e) { location.act(location.data = window.location + '') }
    }
    return location.act()
};
syn.email = function email(val) {
    var act = syn.tez('');
    function email(val) {
        if (arguments.length) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? act(val) : new Error('Error email')
        else return act()
    };
    email.prototype = syn.tez;
    if (arguments.length) email(val);
    return email
};

// Console
syn.tez(function() {
    var data = syn().console;
    if (data instanceof Function) data = data();
    console.log(data)
});
// View
syn.tez((function() {
    var props = {
        '': function(node, data, key) {
            console.error('Design: ' + key + ' = ' + data);
        },
        a: function a(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else node.style.boxShadow = data + 'px ' + data + 'px ' + data + 'px ' + data + 'px #000000';
        },
        b: function b(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else node.style.backgroundColor = '#' + data.toString(16).padStart(8, '0');
        },
        c: function c(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else node.style.color = '#' + data.toString(16).padStart(8, '0');
        },
        f: function f(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else node.style.fontFamily = data;
        },
        g: function g(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else {
                var fract = data % 1, numb = data - fract;
                node.style.fontSize = numb + 'px';
                node.style.fontWeight = Math.round((fract || 1) * 100) * 10 - 100
            }
        },
        p: function p(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else node.style.padding = data + 'px';
        },
        pt: function pt(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else node.style.paddingTop = data + 'px';
        },
        pb: function pb(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else node.style.paddingBottom = data + 'px';
        },
        pl: function pl(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else node.style.paddingLeft = data + 'px';
        },
        pr: function pr(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else node.style.paddingRight = data + 'px';
        },
        s: function s(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else node.style.textAlign = data === -1 ? 'left' : data === 1 ? 'right' : data === 0 ? 'center' : 'justify';
        },
        w: function w(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else console.error('Widget = ' + data);
        },
        x: function x(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else {
                var fract = data % 1, numb = data - fract;
                if (numb) node.style.maxWidth = numb + 'px';
                node.style.width = (fract || 1) * 100 + '%'
            }
        },
        y: function y(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else {
                node.setAttribute('data-v', '');
                var fract = data % 1, numb = data - fract;
                if (numb) node.style.minHeight = numb + 'px';
                if (fract || !numb) node.style.height = (fract || 1) * 100 + '%'
            }
        },
        z: function z(node, data, key) {
            if (data instanceof Function) syn.tez(function() { props[key](node, data()) });
            else console.error('Z = ' + data);
        }
    };
    function view(node, data) {
        node.textContent = '';
        if (data instanceof Function) {
            if (data.prototype === syn.tez) {
                var inp = node.appendChild(document.createElement('input'));
                inp.value = data()
            } else syn.tez(function() { view(node, data()) })
        } else if (typeof data === 'number') node.appendChild(document.createElement('r-num')).textContent = data;
        else if (typeof data === 'string') node.appendChild(document.createElement('span')).textContent = data;
        else if (data instanceof Array) {
            for (var i = 0, t; i < data.length; i++) {
                t = data[i];
                if (t && t.constructor === Object) for (var key in t) { if (t.hasOwnProperty(key)) (props[key] || props[''])(node, t[key], key) }
                else if (t instanceof Array) {
                    if (node.childNodes.length) node.appendChild(document.createElement('s-g')).textContent = ' ';
                    view(node.appendChild(document.createElement('div')), t)
                } else view(node, t)
            }
        } else if (data !== null && data !== undefined) for (var key in data) if (data.hasOwnProperty(key)) {
            if (key) for (var key in t) { if (t.hasOwnProperty(key)) (props[key] || props[''])(node, t[key], key) }
            else view(node, data[key])
        }
    }
    return function go() {
        if (document.body) { document.body.textContent = ''; view(document.body.appendChild(document.createElement('div')), syn().view) } else setTimeout(go, 100)
    }
})());
