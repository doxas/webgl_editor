var ax;
var editors = [];
var editorNames = ['Javascript', 'HTML', 'Vertex', 'Fragment'];
var editorModes = ['javascript', 'html', 'glsl', 'glsl'];
var editorTheme = ['monokai', 'monokai', 'merbivore', 'merbivore'];
var ajaxTarget = '';

window.onload = function(){
	var e, s, t;
	editorInitialize();
	win = window;
	win.addEventListener('keydown', keydown, true);
	for(var i = 0, l = editorNames.length; i < l; i++){
		bid('tab' + editorNames[i]).addEventListener('click', tabSelecter, true);
	}
	run = false;
	
	// ajax
	ax = new Ajax(function(){
		var r = ax.getResponse();
		if(r != null){
			if(r !== 'bad request'){
				s = dirPath();
				switch(ajaxTarget){
					case s + 'templete.php':
						try{
							t = JSON.parse(r);
						}catch(err){
							return;
						}
						if(t != null){
							if(t['javascript'] != null && t['html'] != null && t['vs'] != null && t['fs'] != null){
								editors[0].setValue(t['javascript']);
								editors[1].setValue(t['html']);
								editors[2].setValue(t['vs']);
								editors[3].setValue(t['fs']);
								editors[1].gotoLine(1);
								editors[2].gotoLine(1);
								editors[3].gotoLine(1);
								setTimeout(function(){editors[0].gotoLine(1);}, 100);
							}
						}
						break;
					case s + 'append.php':
						t = editors[0].getValue() + r;
						editors[0].setValue(t);
						editors[0].gotoLine(editors[0].getSession().getLength());
						break;
				}
			}
		}
	});
	ax.initialize();
	
	e = bid('loadButton');
	e.addEventListener('click', editorLoadTemplete, true);
	e = bid('appendButton');
	e.addEventListener('click', editorAppend, true);
	e = bid('runButton');
	e.addEventListener('click', init, true);
};

function editorInitialize(){
	for(var i = 0, l = editorNames.length; i < l; i++){
		editors[i] = editorGenerate('editor' + editorNames[i], editorModes[i], editorTheme[i]);
	}
}

function editorGenerate(id, mode, theme){
	var elm;
	elm = ace.edit(id);
	elm.setTheme("ace/theme/" + theme);
	elm.getSession().setMode("ace/mode/" + mode);
	elm.getSession().setUseSoftTabs(false);
	bid(id).style.fontSize = '14px';
	return elm;
}

function editorLoadTemplete(eve){
	var e = bid('loadSample');
	if(e.value === ''){return;}
	ajaxTarget = dirPath() + 'templete.php';
	ax.requestPost(ajaxTarget, {sample: e.value});
}

function editorAppend(eve){
	var e = bid('appendFunction');
	if(e.value === ''){return;}
	ajaxTarget = dirPath() + 'append.php';
	ax.requestPost(ajaxTarget, {append: e.value});
}

function init(){
	var b, d, e, f;
	var s, t;
	e = bid('frame');
	try{e.contentWindow.WE.run = false;}catch(err){}
	f = e.parentNode;
	f.removeChild(e);
	e = null;
	e = document.createElement('iframe');
	e.id = 'frame';
	f.insertBefore(e, f.firstChild);
	d = e.contentDocument;
	d.open();
	d.write(editors[1].getValue());
	d.close();
	b = d.body;
	s =  'var WE = {parent: window.parent, console: null, button: null, run: false, err: null, vs: "", fs: "", textures: []};\n';
	s += 'function initialize(){\n';
	s += '  WE.vs = "' + editors[2].getValue().replace(/\n/g, '\\n') + '";\n';
	s += '  WE.fs = "' + editors[3].getValue().replace(/\n/g, '\\n') + '";\n';
	s += '  WE.run = false;\n';
	s += '  WE.console = WE.parent.document.getElementById("console");\n';
	s += '  WE.button = WE.parent.document.getElementById("stopButton");\n';
	s += '  WE.button.addEventListener("click", function(){WE.run = false;}, true);\n';
	s += '  window.onerror = function(msg, url, line){\n';
	s += '    var e = WE.parent.document.createElement("p");\n';
	s += '    var f = WE.parent.document.createElement("strong");\n';
	s += '    f.textContent = msg + "; line " + Math.max(line - 30, 0);\n';
	s += '    e.appendChild(f);\n';
	s += '    WE.console.insertBefore(e, WE.console.firstChild);\n';
	s += '    WE.err = msg;\n';
	s += '    return true;\n';
	s += '  };\n';
	s += '  window.console.log = function(msg){\n';
	s += '    var e = WE.parent.document.createElement("p");\n';
	s += '    var f = WE.parent.document.createElement("em");\n';
	s += '    if(typeof msg === "number"){\n';
	s += '      f.textContent = "log: " + msg;\n';
	s += '    }else if(msg instanceof Array){;\n';
	s += '      f.textContent = "log: " + "[" + msg.join(\', \') + "]";\n';
	s += '    }else{;\n';
	s += '	    f.textContent = "log: \'" + msg + "\'";\n';
	s += '    };\n';
	s += '    e.appendChild(f);\n';
	s += '    WE.console.insertBefore(e, WE.console.firstChild);\n';
	s += '  };\n';
	s += editors[0].getValue() + '}';
	s += 'var scr = document.createElement("script");\n';
	s += 'scr.onload = function(){initialize();}\n';
	s += 'scr.src = "http://wgld.org/j/minMatrixb.js"\n';
	s += 'document.body.appendChild(scr);\n';
	t = d.createElement('script');
	t.textContent = s;
	b.appendChild(t);
	if(e.contentWindow.WE != null){
		if(e.contentWindow.WE.err === null){
			e = bid('console');
			f = document.createElement('p');
			d = new Date();
			f.textContent = 'reload [' + zeroPadding(d.getHours(), 2) + ':' + zeroPadding(d.getMinutes(), 2) + ']';
			e.insertBefore(f, e.firstChild);
		}
	}else{
		e = document.createElement('p');
		f = document.createElement('strong');
		f.textContent = 'editor -> javascript syntax error';
		e.appendChild(f);
		f = bid('console');
		f.insertBefore(e, f.firstChild);
	}
}

function tabSelecter(eve){
	var c, d, e, t;
	e = eve.currentTarget;
	if(e.className.match(/active/)){return;}
	t = e.id.replace('tab', '');
	for(var i = 0, l = editorNames.length; i < l; i++){
		if(t === editorNames[i]){
			c = 'editor selected';
			d = 'tab active';
		}else{
			c = 'editor';
			d = 'tab';
		}
		bid('editor' + editorNames[i]).className = c;
		bid('tab' + editorNames[i]).className = d;
	}
	editorInitialize();
}

function keydown(eve){
	if(eve != null){
		if(eve.ctrlKey || eve.metaKey){
			if(eve.keyCode === 83){
				eve.returnValue = false;
				setTimeout(init, 100);
				return false;
			}
		}else{
			try{
				bid('frame').contentWindow.WE.run = (eve.keyCode !== 27);
			}catch(err){}
		}
	}
}

function bid(id){return document.getElementById(id);}

function zeroPadding(num, count){
	var z = (new Array(count)).join('0');
	if((num + '').length > count){return num + '';}
	return (z + num).slice(-1 * count);
}

function dirPath(){
	var a = location.href.split('/');
	a.pop();
	return a.join('/') + '/';
}

function Ajax(callBackFunction){
	var response = '';
	this.h;
	this.initialize = function(){
		if(window.XMLHttpRequest){this.h = new XMLHttpRequest();}
		if(this.h){
			response = '';
			return true;
		}else{
			return false;
		}
	};
	if(callBackFunction != null){
		this.callBack = function(){
			if(this.readyState === 4){
				response = this.responseText;
				callBackFunction();
			}
		};
	}else{
		this.callBack = undefined;
	}
	this.requestPost = function(url, param){
		var s = '';
		if(!this.h){return false;}
		if(param){s = this.convertParam(param);}
		this.h.abort();
		this.h.open('post', url, true);
		if(this.callBack != null){
			this.h.onreadystatechange = this.callBack;
		}
		this.h.setRequestHeader('X-From', location.href);
		this.h.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		this.h.send(s);
	};
	this.getResponse = function(){
		return response;
	};
	this.convertParam = function(paramArray){
		var param = new Array();
		for(var v in paramArray){
			var s = encodeURIComponent(v).replace(/%20/g, '+');
			s += '=' + encodeURIComponent(paramArray[v]).replace(/%20/g, '+');
			param.push(s);
		}
		s = param.join('&');
		return s;
	};
}

