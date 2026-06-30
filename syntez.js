var syntez = (function () {
    var gen = 0, wtr = null;
    function supply(src) {
        var wts = src.wts;
        if (src.wts && src.wts.length) {
            delete src.wts;
            var i = wts.length, wtr;
            while(i--) {
                wtr = wts[i];
                wtr()
            }
            for (i = wts.length - 1; i >= 0; i--) {
                if (wts[i].gen !== gen) {
                    var d = wts[i].dps, j = d.length;
                    while(j--) if (d[j] === src) {
                        d[j] = d[d.length - 1];
                        d.length--;
                        break
                    }
                    wts[i] = wts[wts.length - 1];
                    wts.length--
                }
            }
            src.wts = wts
        }
    }


    function syntez(data) {
        for (var k in data) if (Object.hasOwnProperty.call(data, k)) switch(k) {
            case'console':
                consoleSet(data.console, data);
                break;
            case'html': {
                var h = data.html;
                for (var k in h) if (Object.hasOwnProperty.call(h, k)) switch(k) {
                    case'head': {
                        document.head.textContent = '';
                        document.head.appendChild(html(h.head, document.head, 'meta'));
                        break
                    }
                    case'body': {
                        document.body.textContent = '';
                        document.body.appendChild(html(h.body, document.body, 'main'));
                        break
                    }
                    default: htmlAttr(document.documentElement, k, h[k])
                }
            } break
        }
    }


    syntez.keys = function() {
        var k = { Control: false, Shift: false, Alt: false, Meta: false};
        function keys() {
            var wts = keys.wts, i = wts ? wts.length : 0;
            if (wts) while(i--) if (wts[i] === wtr) break;
            if (i < 0) { wts[wts.length] = wtr; wtr.dps[wtr.dps.length] = keys }
            return k
        }
        keys.wts = [];
        window.onkeydown = function(e) {
            k = { Control: e.ctrlKey, Shift: e.shiftKey, Alt: e.altKey, Meta: e.metaKey };
            k[e.key] = e.code;
            supply(keys)
        };
        window.onkeyup = function(e) {
            k = { Control: e.ctrlKey, Shift: e.shiftKey, Alt: e.altKey, Meta: e.metaKey };
            supply(keys)
        };
        window.onblur = function() {
            k = { Control: false, Shift: false, Alt: false, Meta: false};
            supply(keys)
        };
        return(syntez.keys = keys)()
    };

    syntez.var = function(def) {
        function VAR(data) {
            if (arguments.length) {
                VAR.val = data;
                supply(VAR)
            } else {
                var wts = VAR.wts, i = wts ? wts.length : 0;
                if (wts) while(i--) if (wts[i] === wtr) break;
                if (i < 0) { wts[wts.length] = wtr; wtr.dps[wtr.dps.length] = VAR }
                if (!Object.hasOwnProperty.call(VAR, 'val')) {
                    if (def instanceof Function) {
                        var oldWtr = wtr;
                        wtr = VAR;
                        VAR.gen = gen;
                        try { def() }
                        finally { wtr = oldWtr }
                    } else VAR.val = def
                }
                return VAR.val
            }
            return VAR.val
        }
        VAR.wts = [];
        VAR.dps = [];
        return VAR
    }


    function consoleSet(data, ctx) {
        if (data instanceof Function) {
            function set() {
                var oldWtr = wtr;
                wtr = set;
                set.gen = gen;
                try { consoleSet(data.call(ctx), ctx) }
                finally { wtr = oldWtr }
            }
            set.dps = [];
            set()
        } else if (data !== undefined) {
            // console.clear();
            console[data instanceof Error ? 'error' : 'dir'](data)
        }
    }

    function htmlAttr(el, key, val) {
        if (val instanceof Function) {
            function htmlAttrUp() {
                var oldWtr = wtr;
                wtr = htmlAttrUp;
                htmlAttrUp.gen = gen;
                try { htmlAttr(el, key, val()) }
                finally { wtr = oldWtr }
            }
            htmlAttrUp.dps = [];
            htmlAttrUp()
        } else {
            el.setAttribute(key, val)
        }
    }

    function htmlSrc(el, val) {
        if (val instanceof Function) {
            function htmlSrcUp() {
                var oldWtr = wtr;
                wtr = htmlSrcUp;
                htmlSrcUp.gen = gen;
                try { htmlSrc(el, val()) }
                finally { wtr = oldWtr }
            }
            htmlSrcUp.dps = [];
            htmlSrcUp()
        } else {
            el.src = val
        }
    }

    function htmlValue(el, val) {
        if (val instanceof Function) {
            var up = true;
            function htmlValueUp() {
                if (up) {
                    var oldWtr = wtr;
                    wtr = htmlValueUp;
                    htmlValueUp.gen = gen;
                    try { htmlValue(el, val()) }
                    finally { wtr = oldWtr }
                }
            }
            htmlValueUp.dps = [];
            htmlValueUp();
            if (val.name === 'VAR') el.oninput = function() {
                var wts = val.wts, i = wts.length;
                up = false;
                val(this.value);
                up = true
            }
        } else {
            el.value = val
        }
    }

    function html(data, $, tag) {
        if (data instanceof Function) {
            function htmlUp() {
                var oldWtr = wtr;
                wtr = htmlUp;
                htmlUp.gen = gen;
                try {
                    $.textContent = '';
                    return $.appendChild(html(data(), $, tag))
                } finally { wtr = oldWtr }
            }
            htmlUp.dps = [];
            return htmlUp()
        } else if (data instanceof Array) {
            var el = document.createDocumentFragment();
            for (var i = 0, l = data.length; i < l; i++) el.appendChild(html(data[i], $, tag));
            return el
        } else if (data instanceof Object) {
            var el = document.createElement(tag = data.tag || tag || 'div');
            switch(tag) { case'figure': tag = 'figcaption'; break; case'select': tag = 'option'; break; case'table': tag = 'tr'; break; case'thead': tag = 'th'; break; case'tbody': tag = 'tr'; break; case'html': tag = 'body'; break; case'body': tag = 'main'; break; case'nav': tag = 'a'; break; case'th': tag = 'td'; break; case'tr': tag = 'td'; break; case'ul': tag = 'li'; break; case'ol': tag = 'li'; break; case'main':case'header':case'footer':case'section':case'article':case'aside': tag = 'div'; break }
            for(var k in data) if (Object.hasOwnProperty.call(data, k)) switch(k) {
                case'tag': break;
                case'val': {
                    if ('value' in el) htmlValue(el, data.val);
                    else if ('src' in el) htmlSrc(el, data.val);
                    else el.appendChild(html(data.val, el, tag));
                    break
                }
                default: htmlAttr(el, k, data[k])
            }
            return el
        } else return document.createTextNode(data)
    }

    return syntez
})()
