Syn.http = function http(uri, headers){
	function request(data){
		if(request.val===null){
			request.val=Syn.Tez(Error("LOADING"));
			fetch(request.uri).then(function(data){return data.text()}).then(function(data){
				request.val(data)
			})
		}
		return request.val()
	}
	request.uri='http:'+(uri?uri:'');
	request.headers=headers;
	request.val=null;
	return request
};
Syn.https = function https(uri, headers){function request(data){if(request.val===null){request.val=Syn.Tez(Error("LOADING"));fetch(request.uri).then(function(data){return data.text()}).then(function(data){request.val(data)})}return request.val()}request.uri='https:'+(uri?uri:'');request.headers=headers;request.val=null;return request};

Syn.location=Syn.Tez(window.location+'');
Syn.pointerX=Syn.Tez(new Error("Initial"));
Syn.pointerY=Syn.Tez(new Error("Initial"));
Syn.width = Syn.Tez(window.innerWidth);
Syn.height = Syn.Tez(window.innerHeight);
Syn.scrollX = Syn.Tez(window.scrollX);
Syn.scrollY = Syn.Tez(window.scrollY);
Syn.focused = Syn.Tez(document.hasFocus());
Syn.online = Syn.Tez(navigator.onLine);
Syn.visible = Syn.Tez(document.visibilityState === 'visible');
Syn.pointerDown = Syn.Tez(false);
Syn.target = Syn.Tez(new Error("Initial"));
Syn.key = Syn.Tez(new Error("Initial"));
Syn.keyCode = Syn.Tez(new Error("Initial"));
Syn.hash = Syn.Tez(window.location.hash);
Syn.pathname = Syn.Tez(window.location.pathname);

window.onresize = function(e) {
    Syn.width(window.innerWidth);
    Syn.height(window.innerHeight)
};
window.onscroll = function(e) {
    Syn.scrollX(window.scrollX);
    Syn.scrollY(window.scrollY)
};
window.onfocus = function(e) {
    Syn.focused(true)
};
window.onblur = function(e) {
    Syn.focused(false)
};
window.ononline = function(e) {
    Syn.online(true)
};
window.onoffline = function(e) {
    Syn.online(false)
};
document.onvisibilitychange = function(e) {
    Syn.visible(document.visibilityState === 'visible')
};
window.onpopstate = window.onhashchange = function(e) {
    Syn.location(window.location + '');
    Syn.hash(window.location.hash);
    Syn.pathname(window.location.pathname)
};
window.onmousedown = function(e) {
    var e = window.event || e, t = e.target || e.srcElement;
    Syn.pointerDown(true);
    Syn.target(t)
};
window.onmouseup = function(e) {
    var e = window.event || e, t = e.target || e.srcElement;
    Syn.pointerDown(false);
    Syn.target(t)
};
window.onkeydown = function(e) {
    var e = window.event || e;
    Syn.key(e.key);
    Syn.keyCode(e.keyCode)
};
window.onkeyup = function(e) {
    var e = window.event || e;
    if (Syn.key() === e.key) {
        Syn.key(null);
        Syn.keyCode(null)
    }
};
window.onmousemove = function(e) {
    var e = window.event || e;
    Syn.pointerX(e.pageX);
    Syn.pointerY(e.pageY)
};