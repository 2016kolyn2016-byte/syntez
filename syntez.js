var syn = (function() {
    var wtr = null, ind = 0;
    function free(deleting) {
        var fn = this;
        if (!fn || !fn.srcs) return;

        // 1. Отписываем эффект из всех источников
        for (var i = 0; i < fn.srcs.length; i++) {
            var wtrs = fn.srcs[i].wtrs;
            var idx = wtrs.indexOf(fn);
            if (idx !== -1) wtrs.splice(idx, 1);
        }
        fn.srcs.length = 0;

        // 2. Если нужно полностью удалить реактив (сигнал/эффект)
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

                // Очистка отпавших зависимостей
                for (var i = 0, j = 0; i < arg.srcs.length; i++) {
                    var src = arg.srcs[i];
                    if (src.ind === arg.ind) {
                        arg.srcs[j++] = src; // Зависимость вызывалась в этом запуске
                    } else {
                        var idx = src.wtrs.indexOf(arg);
                        if (idx !== -1) src.wtrs.splice(idx, 1); // Не вызывалась — отписываем
                    }
                }
                arg.srcs.length = j;
            } else return tez(arg)
        } else return tez()
    };
    return syn
})();


syn.keys = function(key) {
    var data = {}, act = syn.tez(data);
    syn.keys = function() { return act() };
    window.onkeydown = window.onkeyup = window.onblur = function(e) {
        if (!e.ctrlKey) delete data.Control;
        if (!e.shiftKey) delete data.Shift;
        if (!e.altKey) delete data.Alt;
        if (!e.metaKey) delete data.Meta;
        if (e.type === 'keydown') data[e.key] = e.code;
        else if (e.type === 'keyup') delete data[e.key];
        else data = {};
        act(data)
    };
    return arguments.length ? syn.keys(key) : syn.keys()
};

syn.mouse = function(key) {
    var data = {}, act = syn.tez(data);
    syn.mouse = function() { return act() };
    window.onmousedown = function(e) {
        data.take = e.target;
        act(data)
    };
    window.onmouseup = function(e) {
        delete data.take;
        act(data)
    };
    window.onmousemove = function(e) {
        data.x = e.offsetX;
        data.y = e.offsetY;
        act(data)
    };
    return arguments.length ? syn.mouse(key) : syn.mouse()
};

syn.location = function(key) {
    var data = window.location + '', act = syn.tez(data);
    syn.location = function() { return act() };
    window.onhashchange = function(e) {
        data = window.location + '';
        act(data)
    };
    return arguments.length ? syn.location(key) : syn.location()
};


// View
syn.tez((function() {
    var props = {
        '': function(node, data, key) {
            console.error('Design: ' + key + ' = ' + data);
        },
        a: function a(node, data) {
            node.style.boxShadow = data + 'px ' + data + 'px ' + data + 'px ' + data + 'px #000000';
        },
        b: function b(node, data) {
            node.style.backgroundColor = '#' + data.toString(16).padStart(8, '0');
        },
        c: function c(node, data) {
            node.style.color = '#' + data.toString(16).padStart(8, '0');
        },
        f: function f(node, data) {
            node.style.fontFamily = data;
        },
        g: function g(node, data) {
            var fract = data % 1, numb = data - fract;
            node.style.fontSize = numb + 'px';
            node.style.fontWeight = Math.round((fract || 1) * 100) * 10 - 100
        },
        p: function p(node, data) {
            node.style.padding = data + 'px';
        },
        pt: function pt(node, data) {
            node.style.paddingTop = data + 'px';
        },
        pb: function pb(node, data) {
            node.style.paddingBottom = data + 'px';
        },
        pl: function pl(node, data) {
            node.style.paddingLeft = data + 'px';
        },
        pr: function pr(node, data) {
            node.style.paddingRight = data + 'px';
        },
        s: function s(node, data) {
            node.style.textAlign = data === -1 ? 'left' : data === 1 ? 'right' : data === 0 ? 'center' : 'justify';
        },
        w: function w(node, data) {
            console.error('Widget = ' + data);
        },
        x: function x(node, data) {
            var fract = data % 1, numb = data - fract;
            if (numb) node.style.maxWidth = numb + 'px';
            node.style.width = (fract || 1) * 100 + '%'
        },
        y: function y(node, data) {
            node.setAttribute('data-v', '');
            var fract = data % 1, numb = data - fract;
            if (numb) node.style.minHeight = numb + 'px';
            if (fract || !numb) node.style.height = (fract || 1) * 100 + '%'
        },
        z: function z(node, data) {
            console.error('Z = ' + data);
        }
    };
    function view(node, data) {
        node.textContent = '';
        if (data instanceof Function) console.error('Reactive data is not supported yet');
        else if (typeof data === 'number') node.appendChild(document.createElement('r-num')).textContent = data;
        else if (typeof data === 'string') node.appendChild(document.createElement('span')).textContent = data;
        else if (data instanceof Array) {
            for (var i = 0, t; i < data.length; i++) {
                t = data[i];
                if (t && t.constructor === Object) for (var key in t) { if (t.hasOwnProperty(key)) (props[key] || props[''])(node, t[key], key) }
                else if (t instanceof Array) {
                    if (node.childNodes.length) node.appendChild(document.createElement('s-g')).textContent = ' ';
                    view(node.appendChild(document.createElement('div')), t);
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
