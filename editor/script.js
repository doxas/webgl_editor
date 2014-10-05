var run, gl, prg, uni;
var editors = [];
var editorNames = ['HTML', 'Javascript'];
var editorModes = ['html', 'javascript'];

window.onload = function(){
	editorInitialize();
	win = window;
	win.addEventListener('keydown', keydown, true);
	for(var i = 0, l = editorNames.length; i < l; i++){
		bid('tab' + editorNames[i]).addEventListener('click', tabSelecter, true);
	}
	run = false;
};

function editorInitialize(){
	for(var i = 0, l = editorNames.length; i < l; i++){
		editors[i] = editorGenerate('editor' + editorNames[i], editorModes[i]);
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

function init(){
	alert('init!');
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

