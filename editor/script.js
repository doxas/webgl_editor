var ax, run, gl, prg, uni;
var editors = [];
var editorNames = ['HTML', 'Vertex', 'Fragment', 'Javascript'];
var editorModes = ['html', 'glsl', 'glsl', 'javascript'];
var ajaxTarget = dirPath() + 'append.php';;

window.onload = function(){
	var e, f;
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
				alert('test');
			}
		}
	});
	ax.initialize();
	
	e = bid('appendButton');
	e.addEventListener('click', editorAppend, true);
	e = bid('runButton');
	e.addEventListener('click', init, true);
};

function editorInitialize(){
	for(var i = 0, l = editorNames.length; i < l; i++){
		editors[i] = editorGenerate('editor' + editorNames[i], editorModes[i]);
		bid('editor' + editorNames[i]).style.fontSize = '14px';
	}
}

function editorGenerate(id, mode){
	var elm;
	elm = ace.edit(id);
	elm.setTheme("ace/theme/monokai");
	elm.getSession().setMode("ace/mode/" + mode);
	elm.commands.addCommand({
		name: 'cmd',
		bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
		exec: function(elm){init();}
	});
	elm.getSession().setUseSoftTabs(false);
	bid(id).style.fontSize = '12px';
	return elm;
}

function editorAppend(eve){
	var e;
	e = bid('appendFunction');
	if(e.value === ""){return;}
	ax.requestPost(ajaxTarget, {append: e.value});
}

function init(){
	var b, d, e, f;
	var s, t;
	e = bid('console');
	f = document.createElement('p');
	f.textContent = 'reload';
	e.insertBefore(f, e.firstChild);
	e = bid('frame');
	d = e.contentDocument;
	d.open();
	d.write(editors[0].getValue());
	d.close();
	b = d.body;
	s =  'var WE = {parent: window.parent, console: null, button: null, run: false, vs: "", fs: "", textures: []};\n';
	s += 'WE.vs = "' + editors[1].getValue().replace(/\n/g, '\\n') + '";\n';
	s += 'WE.fs = "' + editors[2].getValue().replace(/\n/g, '\\n') + '";\n';
	s += 'WE.run = false;\n';
	s += 'WE.console = WE.parent.document.getElementById("console");\n';
	s += 'WE.button = WE.parent.document.getElementById("stopButton");\n';
	s += 'WE.button.addEventListener("click", function(){WE.run = false;}, true);\n';
	s += 'window.onerror = function(msg, url, line){\n';
	s += '  var e = WE.parent.document.createElement("p");\n';
	s += '  var f = WE.parent.document.createElement("em");\n';
	s += '  f.textContent = msg + ": line " + line;\n';
	s += '  e.appendChild(f);\n';
	s += '  WE.console.insertBefore(e, WE.console.firstChild);\n';
	s += '  return true;\n';
	s += '};\n';
	s += editors[3].getValue();
	t = d.createElement('script');
	t.textContent = s;
	b.appendChild(t);
}

function render(){
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

function keydown(eve){run = (eve.keyCode !== 27);}

function bid(id){return document.getElementById(id);}

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

